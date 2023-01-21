const registerHandlebarHelpers = () => {
    Handlebars.registerHelper('fieldNumber', (value, options) => {
        return new Handlebars.SafeString(
            (options.hash.label ? `<label><span class="field-label">${options.hash.label}</span>` : '') +
            `<input type="number" data-field="number" ` +
                Object.entries(options.hash)
                    .reduce((attributes, [key, value]) => {
                        if (['hint', 'label'].includes(key)) return attributes

                        if (['disabled', 'required'].includes(key) && value === true) {
                            return [...attributes, key]
                        }

                        const val = value ?? null;

                        return [...attributes, val ? `${key}="${value}"` : '']
                    }, [])
                    .join(' ') +
            ` value="${value ?? ''}"` +
            `>` +
            (options.hash.label ? `</label>` : '') +
            (options.hash.hint ? `<p class="field-hint">${options.hash.hint}</p>` : '')
        )
    });
};

var Logger = (method) => (...args) => {
    if (CONFIG.debug?.logs) {
        if (!method || typeof method === 'string') console[method || 'log'](...args);
        else args.forEach((arg, index) => {
            console[method?.[index] ?? 'log'](arg);
        });
    }
};

const localizer = target => game.i18n.localize(target);

const rounding = (dir = null) => (number, increment, offset) => {
    const roundingDir = dir ?? 'round';
    if (!increment) return number
    return Math[roundingDir]((number - offset) / increment ) * increment + offset
};

const round = rounding();

var defaultMechanicSettings = {
    diceSize: 10,
    maxDicePoolSize: 10,
};

const numberFieldListener = (html) => {
    html
        .find('input[data-field="number"]')
        .change(event => {
            const el = event.target;
            
            if (!el.required && !el.value && el.value !== 0) return

            const max = el.max || el.max === 0 ? +el.max : null;
            const min = el.min || el.min === 0 ? +el.min : null;
            const step = +el.step;
            const value = +el.value;
            
            if ((min || min === 0) && value < min) {
                el.value = min;
                return
            }
            
            if ((max || max === 0) && value > max) {
                el.value = max;
                return
            }

            if (step) {
                el.value = round(value, step, min ?? 0);
            }

            console.log(el.value);
        });
};

const fieldListeners = (html) => {
    numberFieldListener(html);
};

class OreGeneralSettings extends FormApplication {
    constructor() {
        super();
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ['ore', 'general-settings', 'settings'],
            closeOnSubmit: false,
            height: 900,
            id: 'general-settings',
            left: 400,
            resizable: true,
            submitOnChange: true,
            submitOnClose: true,
            template: 'systems/ore/system/templates/OreGeneralSettings.html',
            title: localizer('GeneralSettings'),
            top: 200,
            width: 600,
        })
    }

    getData() {
        const mechanicSettings = this.deserializeMechanicSettings();
        
        const data = {
            mechanicSettings,
        };

        Logger()('OreGeneralSettings.getData data', data);
        
        return data 
    }

    async _updateObject(event, formData) {
        Logger()(
            'OreGeneralSettings._updateObject event, formData',
            event,
            formData
        );

        const expandedData = expandObject(formData);
        const mechanicSettings = game.settings.get('ore', 'mechanicSettings');

        const diceSizeSchema = mechanicSettings.schema.fields.diceSize;

        expandedData.maxDicePoolSize = +expandedData.maxDicePoolSize;
        expandedData.diceSize = diceSizeSchema.choices[expandedData.diceSize];

        Logger()('OreGeneralSettings._updateObject serialized mechanicSettings:', expandedData);
        
        await game.settings.set('ore', 'mechanicSettings', expandedData);
        
        this.render(true);
    }

    activateListeners(html) {
        super.activateListeners(html);

        Logger()('OreGeneralSettings.activateListeners html:', html);

        fieldListeners(html);
    }

    deserializeMechanicSettings () {
        const mechanicSettings = game.settings.get('ore', 'mechanicSettings');

        Logger()('OreGenealSettings.deserializeMechanicSettings mechanicSettings:', mechanicSettings);

        const diceSizeSchema = mechanicSettings.schema.fields.diceSize;
        const maxDicePoolSizeSchema = mechanicSettings.schema.fields.maxDicePoolSize;
        
        const deserializedData = {
            ...mechanicSettings,
            diceSize: {
                choices: diceSizeSchema.choices,
                index: diceSizeSchema.choices
                    .findIndex(value => value === mechanicSettings.diceSize)
                    .toString(),
                value: mechanicSettings.diceSize,
            },
            maxDicePoolSize: {
                max: maxDicePoolSizeSchema.max,
                min: maxDicePoolSizeSchema.min,
                step: maxDicePoolSizeSchema.step,
                value: mechanicSettings.maxDicePoolSize
            }
        };

        Logger()('OreGenealSettings.deserializeMechanicSettings deserializedData:', deserializedData);

        return deserializedData
    }
}

const fields = foundry.data.fields;

class OreMechanicSettingsModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            diceSize: new fields.NumberField({
                choices: [10, 6],
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

const registerSettings = () => {
    game.settings.registerMenu('ore', 'GeneralSettings', {
        hint: localizer('GeneralSettingsHint'),
        icon: 'fas fa-user-cog',
        label: localizer('GeneralSettings'),
        name: localizer('GeneralSettings'),
        restricted: true,
        type: OreGeneralSettings,
    });

    game.settings.register('ore', 'mechanicSettings', {
        config: false,
        default: defaultMechanicSettings,
        name: localizer('MechanicSettings'),
        scope: 'world',
        type: OreMechanicSettingsModel,
    });
};

Hooks.once('init', () => {
  CONFIG.debug.logs = true;

  Logger()('Initializing ORE system...');

  registerSettings();
  registerHandlebarHelpers();
});
//# sourceMappingURL=ore.mjs.map
