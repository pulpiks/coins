import { STATES } from "../constants/constants";

interface MainMenuInterface {
    readonly text: string
    readonly targetState: string
}

export let mainMenu = [{
    text: 'Start Game',
    targetState: STATES.Game
}, {
    text: 'Guide',
    targetState: STATES.Help
}];

// newGameMenu = [{
//     text: 'Start a new game'
// }, {
//     text: 'Back',
//     targetState: 'MainMenu'
// }];

// loadGameMenu = [{
//     text: 'Load a saved game'
// }, {
//     text: 'Back',
//     targetState: 'MainMenu'
// }];



const config = {
    textStyle: {
        font: "24px Arial",
        fill: "#888"
    },
    textStyleFocused: {
        font: '30px Arial',
        fill: '#000',
        backgroundColor: '#888'
    }
};


export const MenuWrapper = function() {
    return new Menu('Menu:', mainMenu);
}

export class Menu extends Phaser.State {
    focused: number = 0
    keyboard: Phaser.Keyboard
    controls: any
    heading: string
    options: MainMenuInterface[]
    menuItems: MenuItem[]
    constructor(heading: string, options: MainMenuInterface[]) {
        super();

        this.heading = heading;
        this.options = options;
    }

    create() {
        this.focused = 0;

        this.keyboard = this.game.input.keyboard;

        this.controls = this.keyboard.addKeys({
            up: Phaser.Keyboard.UP,
            down: Phaser.Keyboard.DOWN,
            left: Phaser.Keyboard.LEFT,
            right: Phaser.Keyboard.RIGHT,
            interact: Phaser.Keyboard.ENTER
        });

        this.game.add
            .text(this.game.world.centerX, this.game.world.centerY - 100, this.heading, config.textStyle)
            .anchor.set(0.5);
        
        this.menuItems = [];

        for (let i = 0; i < this.options.length; i++) {
            let options,
                menuItem;

            options = this.options[i];

            menuItem = new MenuItem(this.game, this.game.world.centerX, this.game.world.centerY + (((i + 1) * 70)), options.text, options.targetState);

            this.menuItems.push(menuItem);
        }

        this.menuItems[this.focused].focus(true);

        this.controls.interact.onDown.add(this.activateFocusedItem, this);
        this.controls.up.onDown.add(this.selectItem, this, 0, -1);
        this.controls.down.onDown.add(this.selectItem, this, 0, 1);
    }

    selectItem(key: any, delta: number) {
        this.menuItems[this.focused].focus(false);

        this.focused += delta;

        if (this.focused >= this.menuItems.length) {
            this.focused -= this.menuItems.length;
        } else if (this.focused < 0) {
            this.focused += this.menuItems.length;
        }

        this.menuItems[this.focused].focus(true);
    }

    activateFocusedItem() {
        this.menuItems[this.focused].navigate();
    }
}

class MenuItem extends Phaser.Text {
    focused: boolean
    targetState: string
    options: MainMenuInterface[]
    baseText: string

    constructor(
        game: Phaser.Game, 
        x: number, 
        y: number, 
        text: string, 
        targetState: string, 
        focused = false
    ) {
        super(game, x, y, text, config.textStyle);

        this.baseText = text;
        this.targetState = targetState;
        this.focused = focused;

        this.game.world.addChild(this);
        this.anchor.set(0.5)
    }

    focus(focused: boolean) {
        if (focused) {
            this.focused = true;
            this.setStyle(config.textStyleFocused);
        } else {
            this.focused = false;
            this.setStyle(config.textStyle);
        }
    }

    navigate() {
        if (this.targetState) {
            this.game.state.start(this.targetState);
        }
    }

    select() {
        this.text = this.baseText 
    }
}
