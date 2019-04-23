
//  Created by SoMedia OSAR on 12/03/2019.
//  Copyright © 2019 SoMedia OSAR. All rights reserved.
//

/**
 * EndState class, called when game is over
 */
var EndState = State.extend({

	/**
	 * Constructor
	 *
	 * @param  {Game} game manager for the state
	 */
	init: function(game) {
		this._super(game); // call super constructor

		this.hasEnterName = false; // internal stage flag
		this.nick = "Enter your name here";
		this.score = game.stateVars.score;

		// arbitrary hiscore array
		// TODO: implement real hiscore saving with PHP or something
		this.hisores = [
			["Andreas", 18750],
			["Lukas", 15830],
			["Google", 9928],
			["Oiver Thom", 9030],
			["Cecilia", 1300],
		];

		// get and init inputfiled from DOM
		this.namefield = document.getElementById("namefield");
		this.namefield.value = this.nick;
		this.namefield.focus();
		this.namefield.select();
	},

	/**
	 * @override State.handleInputs
	 *
	 * @param  {InputHandeler} input keeps track of all pressed keys
	 */
	handleInputs: function(input) {
		if (this.hasEnterName) {
			if (input.isPressed("spacebar")) {
				// change the game state
				this.game.nextState = States.MENU;
			}
		} else {
			if (input.isPressed("enter")) {
				// take sate to next stage
				this.hasEnterName = true;
				this.namefield.blur();

				// cleanup and append score to hiscore array
				this.nick = this.nick.replace(/[^a-zA-Z0-9\s]/g, "");
				this.hisores.push([this.nick, this.score]);

				// sort hiscore in ascending order
				this.hisores.sort(function(a, b) {
					return b[1] - a[1];
				});
			}
		}
	},

	/**
	 * @override State.update
	 */
	update: function() {
		if (!this.hasEnterName) {
			this.namefield.focus(); // focus so player input is read
			// exit if same namefield not updated
			if (this.nick === this.namefield.value) {
				return;
			}
			// clean namefield value and set to nick variable
			this.namefield.value = this.namefield.value.replace(/[^a-zA-Z0-9\s]/g, "");
			this.nick = this.namefield.value;
		}
	},

	/**
	 * @override State.render
	 *
	 * @param  {context2d} ctx augmented drawing context
	 */
	render: function(ctx) {
		ctx.clearAll();

		if (this.hasEnterName) {
			// manually tweaked positions for, straightforward text
			// positioning
			ctx.vectorText("Hiscore", 3, null, 130);
			for (var i = 0, len = this.hisores.length; i < len; i++) {
				var hs = this.hisores[i];
				ctx.vectorText(hs[0], 2, 200, 200+25*i);
				ctx.vectorText(hs[1], 2, 320, 200+25*i, 10);
			}
			ctx.vectorText("Press space to start a new game", 1, 200, 350);

		} else {

			ctx.vectorText("Thank you for playing", 4, null, 100);
			ctx.vectorText("Your Nickname", 2, null, 180);
			ctx.vectorText(this.nick, 3, null, 220);
			ctx.vectorText(this.score, 3, null, 300);
		}
	}
});
