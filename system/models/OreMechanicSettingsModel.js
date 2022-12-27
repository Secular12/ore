const fields = foundry.data.fields

export default class OreMechanicSettingsModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            diceSize: new fields.NumberField({
                choices: [10, 6],
                initial: 10,
                integer: true,
                nullable: false,
                positive: true,
                required: true,
            })
        }
    }
}