/**
 * Created by Ismaël on 23/03/2017.
 */
export default class EyeModel {
    /**
     * Array composed of {slotModel} objects.
     * @param eye
     */
    constructor(eye) {
        this.eye = eye;
        this.slug =  "eye";
        this.centerCoords = {
            x: null,
            y: null
        };
        this.color = "";
        this._getProps();
        this._insertRelationShips();

    }

    _getProps() {
        let idFragments = [];
        let xPositions = [];
        let yPositions = [];
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
        this.centerCoords.x = this._getCenter(xPositions);
        this.centerCoords.y = this._getCenter(yPositions);
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
}

