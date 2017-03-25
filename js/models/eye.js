/**
 * Created by Ismaël on 23/03/2017.
 */
class EyeModel {
    /**
     * Array composed of {slotModel} objects.
     * @param eye
     */
    constructor(eye) {
        this.eye = eye;
        this.id = this.createId();
    }

    createId() {
        let results = [];
        for(let slot in this.eye) {
            let x = this.eye[slot].x;
            let y = this.eye[slot].y;
            let idSlot = String(x) + String(y);
            results.push(idSlot)
        }
        results = results.sort();
        let id = results.join('');
        return parseInt(id);
    }
}

export default EyeModel