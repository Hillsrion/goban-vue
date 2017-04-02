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
        this.belongsTo = params.belongsTo || null;
        this.lastUsed = params.lastUsed;
        this.isAtari = params.isAtari || false;
        this.hasKoOpportunity = params.hasKoOpportunity || false;
        this.isUsableForStrikeKo = params.isUsableForStrikeKo || 0;
        this.relationships = params.relationships || {};
    }

    /**
     * Redefine some properties when the stone is killed.
     */
    killReset(killedBy) {
        this.isFilled = false;
        this.isFillableBy = killedBy;
        this.isAtari = false;
        this.belongsTo = "";
        this.hasKoOpportunity = false;
        if(this.relationships.eye) {
            this.relationships.eye = [];
        }
    }
}