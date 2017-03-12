/**
 * Created by Ismaël on 09/03/2017.
 */

export default class slotModel {
    constructor(params) {
        this.x = params.x;
        this.y = params.y;
        this.isFilled = params.isFilled;
        this.isFillable = params.isFillable;
        this.time = params.time;
        this.belongsTo = params.belongsTo || null;
        this.lastUsed = params.lastUsed;
        this.isAtari = params.isAtari || false;
    }
}