/**
 * Created by Ismaël on 23/03/2017.
 */
export default class EyeModel {
    /**
     * Array composed of {slotModel} objects.
     * @param {Object} params The parameters of the model.
     */
    constructor(params) {
        this._setProps(params);
        this._insertRelationShips();
    }

    _setProps(params) {
        let idFragments = [];
        let xPositions = [];
        let yPositions = [];
        this.eye = params.eye;
        this.slug =  "eye";
        this.centerCoords = {
            x: null,
            y: null
        };
        this.color = "";
        this.origin = params.origin || null;
        for(let slot in this.eye) {
            if(this.eye[slot]) {
                // Getting slots position to make the id of the eye.
                let x = this.eye[slot].x;
                let y = this.eye[slot].y;
                let idSlot = String(x) + String(y);
                idFragments.push(idSlot);
                /**
                 * Storing positions of slots in arrays. I want 3 entries in the array
                 * because an eye in the goban have 3 differents positions on the x and y axis.
                 */
                if(x && !xPositions.includes(x)) {
                    xPositions.push(x);
                }
                if(y && !yPositions.includes(y)) {
                    yPositions.push(y);
                }
                if(!this.color) {
                    this.color = this.eye[slot].belongsTo;
                }
            } else {
                // Push 00 if the model is null (out of the goban, so there's no instance of SlotModel
                idFragments.push('00');
            }
        }
        idFragments = idFragments.sort();
        this.id = idFragments.join('');
        if(!this.origin) {
            this.centerCoords.x = this._getCenter(xPositions);
            this.centerCoords.y = this._getCenter(yPositions);
        } else {
            this.centerCoords.x = this._getCenterFromOrigin().x;
            this.centerCoords.y = this._getCenterFromOrigin().y;
        }
    }

    /**
     * Get the middle value of an array filled with int. 3 length value required.
     * @param arr
     */
    _getCenter(arr) {
        if(arr.length==3) {
            let min = Math.min(...arr);
            let max = Math.max(...arr);
            if(min+1==max-1) {
                return max-1
            }
        } else {
                console.warn(
                `array given in parameter of the getCenter method of EyeModel
                must have length of 3. Length is ${arr.length}`)
        }
    }

    _insertRelationShips() {
        for(let key in this.eye) {
            if(this.eye[key]) {
                let slot = this.eye[key];
                if(slot) {
                    if(!slot.relationships[this.slug]) {
                        slot.relationships[this.slug] = [this.id];
                    } else {
                        slot.relationships[this.slug].push(this.id);
                    }
                }
            }
        }
    }

    /**
     * Returns the center coords of 3 slots eyes.
     * @returns {Object} Contains x and y positions of the eye.
     * @private
     */
    _getCenterFromOrigin() {
        let center;
        let side = this.origin.side;
        let referenceSlot = this.origin.referenceSlot;
        if(side=="top") {
            center = {x:referenceSlot.x, y:referenceSlot.y-1};
        } else if(side=="bottom") {
            center = {x:referenceSlot.x, y:referenceSlot.y+1};
        } else if(side=="left") {
            center = {x:referenceSlot.x-1, y:referenceSlot.y};
        } else if(side=="right") {
            center = {x:referenceSlot.x+1, y:referenceSlot.y};
        }
        return center;
    }
}

