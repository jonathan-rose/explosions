/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Object Drag Leave Event.
 *
 * This event is dispatched by an interactive Game Object if a pointer drags it out of a drag target.
 *
 * Listen to this event from a Game Object using: `gameObject.on('dragleave', listener)`.
 * Note that the scope of the listener is automatically set to be the Game Object instance itself.
 *
 * To receive this event, the Game Object must have been set as interactive and enabled for drag.
 * See [GameObject.setInteractive]{@link Phaser.GameObjects.GameObject#setInteractive} for more details.
 *
 * @event Phaser.Input.Events#GAMEOBJECT_DRAG_LEAVE
 * @type {string}
 * @since 3.0.0
 *
 * @param {Phaser.Input.Pointer} pointer - The Pointer responsible for triggering this event.
 * @param {Phaser.GameObjects.GameObject} target - The drag target that this pointer has left.
 */
module.exports = 'dragleave';
