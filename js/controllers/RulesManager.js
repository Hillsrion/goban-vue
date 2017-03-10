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
            return {
                atariList: this.getAtariList(),
                takenList: this.getTakenStoneList()
            }
        } else {
            console.warn("goban given in param is null");
        }
    }
    getAtariList() {
        console.log('getAtari');
        console.log(this.currentGoban);
    }

    /**
     * Allows to know if we can set the stone at the position given in params
     * if the stone is not in atari or is in ko situation
     * @param {string} position
     * @returns {boolean}
     */
    canSetStone(position) {
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
        return false;
    }
    getConnectedArea() {

    }
    getTakenStoneList() {
        console.log('getTakenStoneList');
    }

}


export default new RulesManager()