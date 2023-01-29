var fieldInput = (type) => (value, options) => {
  const inputHashIgnore = [
    'class',
    'hint',
    'label',
    'labelClass',
    'wrapperClass'
  ];

  return new Handlebars.SafeString(
    `<div class="field field-${type}` +
    (options.hash.class ? ` ${options.hash.class}` : '') +
    '">' +
    (options.hash.label ? '<label' : '<div') +
    ' class="field-wrapper' +
    (options.hash.wrapperClass ? ` ${options.hash.wrapperClass}` : '') +
    '">'+
    (options.hash.label ? `<span class="field-label` : '') +
    (options.hash.label && options.hash.labelClass ? ' ' + options.hash.labelClass : '') +
    (options.hash.label ? `">${options.hash.label}</span>` : '') +
    `<input type="${type}" ` +
    Object.entries(options.hash)
      .reduce((attributes, [key, value]) => {
        if (inputHashIgnore.includes(key)) return attributes

        if (['disabled', 'required'].includes(key) && value === true) {
          return [...attributes, key]
        }

        if (key === 'inputClass') {
          attributes[0] = `class="field-input ${value}"`;
          return attributes
        }

        const val = value ?? null;

        return [...attributes, val ? `${key}="${value}"` : '']
      }, ['class="field-input"'])
      .join(' ') +
    ` value="${value ?? ''}"` +
    `>` +
    (options.hash.label ? `</label>` : '</div>') +
    (options.hash.hint ? `<p class="field-hint">${options.hash.hint}</p>` : '') +
    '</div>'
  )
};

var fieldSelect = (value, items, name, val, options) => {
  const inputHashIgnore = [
    'class',
    'hint',
    'label',
    'labelClass',
    'wrapperClass'
  ];

  return new Handlebars.SafeString(
    '<div class="field field-select' +
    (options.hash.class ? ` ${options.hash.class}` : '') +
    '">' +
    (options.hash.label ? '<label' : '<div') +
    ` class="field-wrapper` +
    (options.hash.wrapperClass ? ` ${options.hash.wrapperClass}` : '') +
    '">' +
    (options.hash.label ? `<span class="field-label` : '') +
    (options.hash.label && options.hash.labelClass ? ' ' + options.hash.labelClass : '') +
    (options.hash.label ? `">${options.hash.label}</span>` : '') +
    `<select ` +
    Object.entries(options.hash)
      .reduce((attributes, [key, value]) => {
        if (inputHashIgnore.includes(key)) return attributes

        if (['disabled', 'required'].includes(key) && value === true) {
          return [...attributes, key]
        }

        if (key === 'inputClass') {
          attributes[0] = `class="field-input ${value}"`;
          return attributes
        }

        const val = value ?? null;

        return [...attributes, val ? `${key}="${value}"` : '']
      }, ['class="field-input"'])
      .join(' ') +
    `>` +
    items
      .map(item => {
        return `<option value="${item[val]}"` +
        (item[val] === value ? ' selected>' : '>') +
        `${item[name]}</option>`
      })
      .join('') +
    `</select>` +
    (options.hash.label ? `</label>` : '</div>') +
    (options.hash.hint ? `<p class="field-hint">${options.hash.hint}</p>` : '') +
    '</div>'
  )
};

const registerHandlebarHelpers = () => {
    Handlebars.registerHelper({
        add: (a, b) => +a + +b,
        get: (list, key) => list[key] ?? false,
        length: (value) => value?.length ?? null,
        sub: (a, b) => +a - +b,
        tern: (a, b, c) => a ? b : c,
    }),
    Handlebars.registerHelper('times', (n, block) => {
        let accum = '';
        for(let i = 0; i < n; ++i)
            accum += block.fn(i);
        return accum
    });
    Handlebars.registerHelper('fieldNumber', fieldInput('number'));
    Handlebars.registerHelper('fieldSelect', fieldSelect);
    Handlebars.registerHelper('fieldText', fieldInput('text'));
};

var Logger = (method) => (...args) => {
    if (CONFIG.debug?.logs) {
        if (!method || typeof method === 'string') console[method || 'log'](...args);
        else args.forEach((arg, index) => {
            console[method?.[index] ?? 'log'](arg);
        });
    }
};

const displayToggle = (html) => {
  console.log('hello');
  html
    .find('.display-toggle')
    .click(function (event) {
      const $chevronIcon = $(this).find('.fa');
      const { target } = event.currentTarget.dataset;

      $chevronIcon.toggleClass('fa-chevron-down fa-chevron-up');
      html.find(target).toggleClass('hide');
    });
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

const numberFieldListener = function (html) {
  html
    .find('.field-number .field-input')
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
            id: 'GenSettings',
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

        expandedData.maxDicePoolSize = +expandedData.maxDicePoolSize;

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

        const maxDicePoolSizeSchema = mechanicSettings.schema.fields.maxDicePoolSize;
        
        const deserializedData = {
            ...mechanicSettings,
            diceSize: {
                choices: [
                    { name: 'd10', value: 10 },
                    { name: 'd6', value: 6 }
                ],
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

const getRollFormula = (totalDice) => {
    const mechanicSettings = game.settings.get('ore', 'mechanicSettings');
    return `${totalDice}d${mechanicSettings.diceSize}`
};

const getRollResults = async ({ totalDice, rollMode }) => {
    const rollFormula = getRollFormula(totalDice);

    const r = new Roll(rollFormula);

    const roll = await r.evaluate({ async: true });

    if (game.dice3d) {
        const synchronize = rollMode !== 'selfroll';
        const whisper = ['gmroll', 'blindroll'].includes(rollMode)
            ? game.users.filter(u => u.isGM).map(u => u.id)
            : null;
        const blind = rollMode === 'blindroll';
        game.dice3d.showForRoll(r, game.user, synchronize, whisper, blind);
    }

    Logger()('rollDice.getRollResults roll:', roll);

    const rollResults = roll.terms[0].results
        .map(die => die.result);

    return rollResults
        .reduce((results, result) => {
            return {
                ...results,
                [result]: (results[result] ?? 0) + 1
            }
        }, {})
};

async function rollDice (data) {
    Logger()('rollDice.default data:', data);

    const rollResults = await getRollResults(data);

    Logger()('rollDice.default rollResults:', rollResults);

    const { diceSize } = game.settings.get('ore', 'mechanicSettings');
    
    const content = await renderTemplate('systems/ore/system/templates/chat/roll-result.html', {
        ...data,
        diceSize,
        rollResults: Object.entries(rollResults)
            .sort(([a],[b]) => b-a)
            .map(([k, v]) => ({size: k, count: v})),
        speaker: game.user,
    });

    const chatData = ChatMessage.applyRollMode({ content }, data.rollMode);
    ChatMessage.create(chatData);
}

class DicePool extends FormApplication {
    constructor() {
        super();

        const mechanicSettings = game.settings.get('ore', 'mechanicSettings');

        this.customAdd = {
            name: '',
            source: null,
            type: 'custom',
            value: 1,
        };

        this.maxDice = mechanicSettings.maxDicePoolSize;
        this.pool = [];
        this.rollMode = game.settings.get('core', 'rollMode');
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: 'DicePool',
            template: 'systems/ore/system/templates/DicePool.html',
            title: localizer('DicePool'),
            classes: ['ore', 'DicePool'],
            width: 360,
            height: 'auto',
            top: 500,
            left: 20,
            resizable: true,
            closeOnSubmit: false,
            submitOnClose: true,
            submitOnChange: true
        })
    }

    get calculatedDice () {
        return this.pool.reduce((acc, {value}) => acc + (value ?? 0), 0)
    }

    get totalDice () {
        return this.calculatedDice < 0
            ? 0
            : this.calculatedDice > this.maxDice
                ? this.maxDice
                : this.calculatedDice
    }

    async getData () {
        const data = {
            calculatedDice: this.calculatedDice,
            customAdd: this.customAdd,
            maxDice: this.maxDice,
            pool: this.pool,
            rollMode: this.rollMode,
            rollModes: [
                { name: localizer('PublicRoll'), value: 'publicroll' },
                { name: localizer('PrivateGmRoll'), value: 'gmroll' },
                { name: localizer('BlindGmRoll'), value: 'blindroll' },
                { name: localizer('SelfRoll'), value: 'selfroll' },
            ],
            totalDice: this.totalDice
        };

        Logger()('DicePool.getdata data:', data);

        return data
    }

    async _updateObject (event, formData) {
        const expandedData = expandObject(formData);

        Logger()(
            'DicePool._updateObject event, expandedData:',
            event,
            expandedData,
        );

        this.customAdd = {
            ...this.customAdd,
            name: expandedData.customAdd.name,
            value: +(+expandedData.customAdd.value).toFixed()
        };

        this.maxDice = expandedData.maxDice ?? 0;
        this.rollMode = expandedData.rollMode;

        $('#DicePool-total-dice').text(this.totalDice);
    }

    activateListeners (html) {
        super.activateListeners(html);
        fieldListeners.call(this, html);

        html
            .find('#add-custom-dice')
            .click(this._addCustomDice.bind(this));
        
        html
            .find('#clear-dice-pool')
            .click(this._clearDicePool.bind(this));

        html
            .find('#roll-dice-pool')
            .click(this._rollDicePool.bind(this));
        
        html
            .find('.DicePool-pool-item-remove')
            .click(this._removePoolItem.bind(this));
    }

    async toggle () {
        if (!this.rendered) {
            const mechanicSettings = game.settings.get('ore', 'mechanicSettings');
            this.maxDice = mechanicSettings.maxDicePoolSize;

            await this.render(true);
        } else {
            this.close();
        }
    }

    async _addCustomDice(event) {
        this.pool.push(this.customAdd);

        this.customAdd = {
            name: '',
            source: null,
            type: 'custom',
            value: 1,
        };

        this.render(true);
    }

    async _clearDicePool(event) {
        const mechanicSettings = game.settings.get('ore', 'mechanicSettings');

        this.pool = [];

        this.customAdd = {
            name: '',
            source: null,
            type: 'custom',
            value: 1,
        };

        this.maxDice = mechanicSettings.maxDicePoolSize;

        this.render(true);
    }

    _removePoolItem(event) {
        const { index } = event.currentTarget.dataset;

        this.pool = this.pool.filter((item, itemIndex) => itemIndex !== parseInt(index, 10));

        this.render(true);
    }

    async _rollDicePool(event) {
        await rollDice({
            maxDice: this.maxDice,
            pool: this.pool,
            rollMode: this.rollMode,
            totalDice: this.totalDice
        });

        this._clearDicePool();
        this.close();
    }
}

var ready = async () => {
    game.ore.DicePool = new DicePool();
};

var renderChatMessage = (app, html) => {
  const $rollResultMessage = html.find('.RollResult-message');

  if ($rollResultMessage.length) {
    html.addClass('ore RollResult');
  }

  displayToggle(html);
};

var renderSceneControls = (controls, html) => {
    const $dicePoolButton = $(
        `<li class="dice-pool-control" data-control="dice-pool" title="${game.i18n.localize("DicePool")}">
            <i class="fas fa-dice"></i>
            <ol class="control-tools">
            </ol>
        </li>`
    );

    html
        .find('.main-controls')
        .append($dicePoolButton);
    html
        .find('.dice-pool-control')
        .removeClass('control-tool')
        .on('click', async () => {
            await game.ore.DicePool.toggle();
        });
};

var hooks = () => {
  Hooks.on('ready', ready);
  Hooks.on('renderChatMessage', renderChatMessage);
  Hooks.on('renderSceneControls', renderSceneControls);
};

Hooks.once('init', () => {
  CONFIG.debug.logs = true;

  game.ore = {};

  Logger()('Initializing ORE system...');

  registerSettings();
  registerHandlebarHelpers();
  hooks();
});
//# sourceMappingURL=ore.mjs.map
