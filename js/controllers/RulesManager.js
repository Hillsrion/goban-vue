/**
 * Created by Ismaël on 06/03/2017.
 */
const RulesManager = (function() {
   class RulesManager {
       constructor() {
            this.currentGoban = null;
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
       isAtari(position) {
           return false;
       }
       isKo(position) {
           return false;
       }
       getTakenStoneList() {

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
   }
   let App = new RulesManager();
   return App;
});

export default RulesManager