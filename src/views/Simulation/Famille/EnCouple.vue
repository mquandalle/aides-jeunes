<template>
  <form @submit.prevent="onSubmit">
    <fieldset>
      <legend
        ><h2 class="aj-question">Vivez-vous seul·e ou en couple ?</h2></legend
      >
      <div class="aj-selection-wrapper">
        <input
          id="seul"
          type="radio"
          v-bind:value="false"
          name="en_couple"
          v-model="value"
        />
        <label for="seul">Je vis seul·e</label>
      </div>
      <div class="aj-selection-wrapper">
        <input
          id="en-couple"
          type="radio"
          v-bind:value="true"
          name="en_couple"
          v-model="value"
        />
        <label for="en-couple">Je vis en couple</label>
      </div>
    </fieldset>
    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>

<script>
import Actions from "@/components/Actions"

export default {
  name: "SimulationFamilleEnCouple",
  components: {
    Actions,
  },
  data: function () {
    const value = this.$store.getters.getAnswer(
      "famille",
      "famille",
      "en_couple"
    )
    return { value }
  },
  methods: {
    onSubmit() {
      if (this.value === undefined) {
        this.$store.dispatch("updateError", "Ce champ est obligatoire.")
        return
      }

      this.$store.dispatch("answer", {
        id: "famille",
        entityName: "famille",
        fieldName: "en_couple",
        value: this.value,
      })
      this.$push()
    },
  },
}
</script>
