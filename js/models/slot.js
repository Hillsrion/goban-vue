/**
 * Created by Ismaël on 09/03/2017.
 */

export default class SlotModel {
    constructor(params = {}) {
        this.x = params.x;
        this.y = params.y;
        this.isFilled = params.isFilled;
        this.isFillableBy = params.isFillableBy;
        this.time = params.time;
        this.setAtTurn = params.setAtTurn || null;
        this.belongsTo = params.belongsTo || null;
        this.lastUsed = params.lastUsed;
        this.isAtari = params.isAtari || false;
        this.hasKoOpportunity = params.hasKoOpportunity || false;
        this.isUsableForStrikeKo = params.isUsableForStrikeKo || 0;
        this.relationships = params.relationships || {};
        this.isHoshi = params.isHoshi || false;
    }

    /**
     * Redefine some properties when the stone is killed.
     */
    killReset(killedBy) {
        this.isFilled = false;
        if(killedBy) {
            this.isFillableBy = killedBy;
        }
        this.isAtari = false;
        this.belongsTo = "";
        this.hasKoOpportunity = false;
        this._resetRelationships();
    }

    /**
     * Assign the slot relationships properties to empty array except the excluded ones given in parameter.
     * @param excludeList {Array}
     * @private
     */
    _resetRelationships(excludeList=[]) {
        for(let key in this.relationships) {
            let relationship = this.relationships[key];
            if(!excludeList.includes(key)) {
                relationship = null;
            }
        }
    }
    getCoords() {
        return this.x+','+this.y;
    }
}