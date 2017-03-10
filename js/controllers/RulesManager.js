/**
 * Created by Ismaël on 06/03/2017.
 */

class RulesManager {
    constructor() {
        this.currentGoban = [];
    }
    eval(goban) {
        if(goban) {
            this.currentGoban = goban;
            console.log(this.currentGoban);
            return {
                atariList: this.getAtariList(),
                takenList: this.getTakenStoneList()
            }
        } else {
            console.warn("goban given in param is null");
        }
    }
    getAtariList() {
    }

    /**
     * Allows to know if we can set the stone at the position given in params
     * if the stone is not in atari or is in ko situation
     * @param {string} position
     * @returns {boolean}
     */
    canSetStone(position) {
        return true;
        if(!this.isAtari(position) || this.isKo(position)) {
            return true;
        } else {
            return false;
        }
    }

    _isAtari(position) {
        return false;
    }
    _isKo(position) {
        return true;
    }
    getConnectedArea() {

    }
    getTakenStoneList() {
    }

}


export default new RulesManager()