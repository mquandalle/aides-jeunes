package controllers;

import java.io.File;
import java.io.IOException;

import models.Situation;

import org.apache.pdfbox.exceptions.COSVisitorException;
import org.apache.pdfbox.pdmodel.PDDocument;

import pdfwriter.PdfWriter;
import play.Logger;
import play.mvc.BodyParser;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.With;
import actions.AddAccessControlHeadersAction;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import formfiller.ASFFormFiller;
import formfiller.AspaFormFiller;
import formfiller.CAFFormFiller;
import formfiller.CmuFormFiller;
import formfiller.FormFiller;
import formfiller.RSAFormFiller;

@With(AddAccessControlHeadersAction.class)
public class Application extends Controller {

    protected static final ObjectMapper JSON_MAPPER = new ObjectMapper();

    static {
        JSON_MAPPER.setSerializationInclusion(Include.NON_NULL);
        JSON_MAPPER.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    public static Result options(String options) {
        return ok();
    }

    @BodyParser.Of(BodyParser.Json.class)
    public static Result generate(String formId) throws IOException, COSVisitorException {
        Forms form = null;
        for (Forms val : Forms.values()) {
            if (val.id.equals(formId)) {
                form = val;
            }
        }

        if (null == form) {
            return badRequest(String.format("Formulaire inconnu : %s", formId));
        }

        Logger.info(String.format("Génération formulaire %s", formId));
        PDDocument document = PDDocument.load(String.format("resources/%s.pdf", formId));
        Situation situation = getRequest(Situation.class);
        PdfWriter writer = new PdfWriter(document);
        FormFiller filler = form.createFormFiller(writer, situation);
        filler.fill();
        writer.flush();
        File file = File.createTempFile("tmp", ".pdf");
        document.save(file);

        Status result = ok(file, formId.concat(".pdf"));
        file.delete();

        return result;
    }

    private static enum Forms {

        CMUC("cmuc") {

            @Override
            public FormFiller createFormFiller(PdfWriter writer, Situation situation) {
                return new CmuFormFiller(writer, situation);
            }
        },
        ASPA("aspa") {

            @Override
            public FormFiller createFormFiller(PdfWriter writer, Situation situation) {
                return new AspaFormFiller(writer, situation);
            }
        },
        CAF("caf") {

            @Override
            public FormFiller createFormFiller(PdfWriter writer, Situation situation) {
                return new CAFFormFiller(writer, situation);
            }
        },
        RSA("rsa") {

            @Override
            public FormFiller createFormFiller(PdfWriter writer, Situation situation) {
                return new RSAFormFiller(writer, situation);
            }
        },
        ASF("asf") {

            @Override
            public FormFiller createFormFiller(PdfWriter writer, Situation situation) {
                return new ASFFormFiller(writer, situation);
            }
        };

        public final String id;

        Forms(String id) {
            this.id = id;
        }

        public abstract FormFiller createFormFiller(PdfWriter writer, Situation situation);
    }

    protected static <T> T getRequest(Class<T> requestClass) {
        JsonNode json = request().body().asJson();
        JsonFactory factory = JSON_MAPPER.getFactory();

        try {
            JsonParser jsonParser = factory.createParser(json.toString());

            return JSON_MAPPER.readValue(jsonParser, requestClass);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
