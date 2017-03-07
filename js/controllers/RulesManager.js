/**
 * Created by Ismaël on 06/03/2017.
 */

class RulesManager {
    constructor() {
        this.currentGoban = [];
    }
    evalTurn(goban) {
        if(goban) {
            this.currentGoban = goban;
        } else {
            console.warn("goban given in evalTurn param is null");
        }
        this.getAtariList();
        this.getTakenStoneList();
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
        if(!this.isAtari(position) || this.isKo(position)) {
            return true;
        } else {
            return false;
        }
    }

    isAtari(position) {
        return false;
    }
    isKo(position) {
        return false;
    }
    getTakenStoneList() {

    }

}


export default new RulesManager()