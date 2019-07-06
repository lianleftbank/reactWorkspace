var gobang = {
    whitePieces: null, //白棋子HTML元素
    blackPieces: null, //黑棋子HTML元素
    specs: null, //棋盘规格16*16
    cellClass: null, //棋格class,
    piecesType: -1, //当前棋子类型，-1黑棋，1白棋
    pieces: [], //棋子数组,数组中元素值-1，已下黑棋，1已下白棋，0当前棋格还未下子
    playedChess: 0, //已下棋子数
    init: function(arges){//初使化
        this.setParams(arges);
        this.pieces = this.setPieces();   
        this.bindEvent();    
    },
    setParams: function(arges){// 设置参数
        for(var k in arges){
            this[k] = arges[k];
        }
    },
    setPieces: function(){//初使化棋子数组
        var data = [];
        for(var i=0; i<this.specs; i++){
            data[i] = [];
            for(var j=0; j<this.specs; j++){
                data[i][j] = 0;
            }
        }
        return data;
    },
    bindEvent: function(){// 绑定事件合集
        this.ev_playerChess();
    },
    ev_playerChess: function(){ // 为每个棋格元素分配下棋事件
        var domChess = document.querySelectorAll(this.cellClass);
        for(var i=0; i<this.specs; i++){
            for(var j =0; j<this.specs; j++){
                domChess[i*this.specs+j].onclick = this.setPlayerChess(i, j, domChess);
            }
        }
    },
    setPlayerChess: function(i, j, domChess){//设置下棋事件
        var _this = this;
        var myPosition = i*this.specs+j;
        return function(){
            if(_this.pieces[i][j] != 0){//当前棋子数组中元素不为0，表示已经落过子
                return false;
            }
            _this.pieces[i][j] = _this.piecesType;
            if(_this.piecesType == -1){//判断棋手并落子
                domChess[myPosition].innerHTML = _this.blackPieces;
            }else{
                domChess[myPosition].innerHTML = _this.whitePieces;
            }    
            _this.playedChess++; 
            _this.getWinner(i, j);
            _this.switchPlayer();       
        };
    },
    switchPlayer: function(){//更换黑白棋手
        this.piecesType = (this.piecesType==-1)?1:-1;
    },
    getWinner: function(i, j){//计算黑白棋手谁是赢家
        //横
        if(this.computerByHeng(i, j)){
            this.showMsg();
            return false;
        }
        //竖
        if(this.computerByShu(i, j)){
            this.showMsg();
            return false;
        }
        //撇
        if(this.computerByPie(i, j)){
            this.showMsg();
            return false;
        }
        //捺
        if(this.computerByNa(i, j)){
            this.showMsg();
            return false;
        }
        //如果双方都没获胜的情况下，没地方下子的情况下平局
        if(this.playedChess == this.specs*this.specs){
            alert('平局!!!');
            this.reloadPlay();
        }
    },
    computerByHeng: function(indexI, indexJ){
        var num = 0, i, j;
        for(i=indexI, j=indexJ; j>=0; j--){
            if(this.pieces[i][j] == this.piecesType){
                num++;
            }else{
                break;
            }
        }
        for(i=indexI, j=indexJ+1; j<this.specs; j++){
            if(this.pieces[i][j] == this.piecesType){
                num++;
            }else{
                break;
            }
        }
        if(num>=5){
            return true;
        }
        return false;
    },
    computerByShu: function(indexI, indexJ){
        var num = 0, i, j;
        for(i=indexI, j=indexJ; i>=0; i--){
            if(this.pieces[i][j] == this.piecesType){
                num++;
            }else{
                break;
            }
        }
        for(i=indexI+1, j=indexJ; i<this.specs; i++){
            if(this.pieces[i][j] == this.piecesType){
                num++;
            }else{
                break;
            }
        }
        if(num>=5){
            return true;
        }
        return false;
    },
    computerByPie: function(indexI, indexJ){
        var num = 0, i, j;
        for(i=indexI, j=indexJ; i>=0 && j<this.specs; i--, j++){
            if(this.pieces[i][j] == this.piecesType){
                num++;
            }else{
                break;
            }
        }
        for(i=indexI+1, j=indexJ-1; i<this.specs, j>=0; i++, j--){
            if(this.pieces[i][j] == this.piecesType){
                num++;
            }else{
                break;
            }
        }
        if(num>=5){
            return true;
        }
        return false;
    },
    computerByNa: function(indexI, indexJ){
        var num = 0, i, j;
        for(i=indexI, j=indexJ; i>=0 && j>=0; i--, j--){
            if(this.pieces[i][j] == this.piecesType){
                num++;
            }else{
                break;
            }
        }
        for(i=indexI+1, j=indexJ+1; i<this.specs && j<this.specs; i++, j++){
            if(this.pieces[i][j] == this.piecesType){
                num++;
            }else{
                break;
            }
        }
        if(num>=5){
            return true;
        }
        return false;
    },
    showMsg: function(){
        if(this.piecesType == -1){
            alert('黑棋获胜!!!');
        }else{
            alert('白棋获胜!!!');
        }
        this.reloadPlay();
    },
    reloadPlay: function(){//游戏结束后收拾棋子棋局
        //清空棋子数组
        this.pieces = this.setPieces();  
        //清空棋子元素
        this.removeDom('.cell-pieces');
        //已落子数清0
        this.playedChess = 0;
        //重新设为黑棋先手
        this.piecesType = -1;
        console.log(this.pieces);
    },
    removeDom: function(domClass){//从页面上清除元素
        var dom = document.querySelectorAll(domClass);
        dom.forEach(function(v, k){
            v.remove();
        });
    }   
};

gobang.init({
    specs: 16,
    cellClass: ".cell",
    whitePieces: "<div class='centerWH cell-pieces cell-pieces-white'></div>",
    blackPieces: "<div class='centerWH cell-pieces cell-pieces-black'></div>"
});