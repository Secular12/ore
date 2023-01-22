const fields = foundry.data.fields

export default class OreMechanicSettingsModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            diceSize: new fields.NumberField({
                initial: 10,
                integer: true,
                nullable: false,
                positive: true,
                required: true,
            }),
            maxDicePoolSize: new fields.NumberField({
                initial: 10,
                integer: true,
                min: 1,
                nullable: false,
                required: true,
                step: 1,
            })
        }
    }
}