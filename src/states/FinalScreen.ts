class FinalScreen {
    game: Phaser.Game;
    back: Phaser.Text;

    preload() {
        this.game.stage.backgroundColor = 'rgba(0, 0, 0, .8)';
    }

    create() {
        const horizontalOffset = this.game.width / 15;

        this.back = this.game.add.text(
            horizontalOffset,
            this.game.height / 15,
            'i haven\'t decided yet what put down here',
            {
                fill: '#fff'
            }
        );

        const textGroup = this.game.add.group();
        let verticalOffset = 0;
        const spacing = this.game.height / 30;
        const fontSize = Math.min(22, Math.round(this.game.height / 19));
        [
            'sdfsdfsdf',
            '123123123',
            'qweqweqwe'
        ].forEach((text, i) => {
            const textObject = this.game.add.text(
                horizontalOffset,
                verticalOffset,
                `${i + 1}. dfgjdfkgh.`,
                {
                    font: `${fontSize}px Arial`,
                    fill: '#fff',
                    wordWrap: true,
                    wordWrapWidth: this.game.width - horizontalOffset * 2
                }
            );
            verticalOffset += textObject.height + spacing;
            textGroup.add(textObject);
        });
        textGroup.y = (this.game.height + this.back.bottom - verticalOffset + spacing) / 2;

        this.game.input.onDown.add(this.handleClickBack, this);
    }

    handleClickBack() {
        if (this.back.getBounds().contains(this.game.input.x, this.game.input.y)) {
            this.game.input.onDown.remove(this.handleClickBack, this);
            this.game.state.start('Game', true, false);
            return true;
        }
    }
}

export default FinalScreen;