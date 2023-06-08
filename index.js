const gameBoard=(()=>
{
    const board=[
                 ["","",""],
                 ["","",""],
                 ["","",""]
                ];
                
    const getBoardLength=()=>
    {
        return board.length;
    };
    const getFields=(x,y)=>
    {
        return board[x][y];
    }
    const setField=(row,col,player)=>
    {
       
        let num=row*3+col+1;
        let cell=document.querySelector(`.item${num} p`);
        cell.classList.add('center');
        cell.style.color=`${player.getSign()==='X'?"#1a2b33cc":"#dfe0e3"}`;
        cell.textContent=player.getSign();
        board[row][col]=player.getSign();
    }
    
    const getEmptyfield=()=>{
        const field=[];
        for(let i=0;i<board.length;i++)
        {
            for(let j=0;j<board[i].length;j++)
            {   
                if(board[i][j]==="")
                {
                    field.push([i,j]);
                }
            }
        }
    
        return field;
    }
    const clear=()=>
        {
            for(let i=0;i<board.length;i++)
            {
                for(let j=0;j<board.length;j++)
                {
                    board[i][j]="";
                }
            }
        };

    return{
        clear,
        setField,
        getBoardLength,
        getFields,
        getEmptyfield
        };
})();

//Create Player
const createPlayer=(piece,score)=>
{
    let sign=piece;
    const getSign=()=>{return sign}
    const getScore=()=>{return score};
    const updateScore=()=>{
        score++;
    }
    return{getSign,getScore,updateScore};
};

const gameController=(()=>{

    let player=createPlayer('X',0);
    let computer=createPlayer('O',0);

    const getPlayersScore=()=>{
        return player.getScore();
    }
    const getBotScore=()=>{
       return computer.getScore();
    }
    const sleep=(sec)=>{
        return new Promise(resolve=>setTimeout(resolve,sec))
    }
    const playerStep=(row,col)=>
    {      
        const field=gameBoard.getFields(row,col);
        console.log(field+"dai"+row+" "+col);
        if(field==="")
        {
            gameBoard.setField(row,col,player);
            if(checkWinner(player.getSign(),row,col))
            {
                player.updateScore();
                console.log("Winner Player");
             
                (async()=>{
                    await sleep(500);
                    displayController.updatePlayerScore();
                    displayController.showResult(player.getSign());
                   
                })();
              
            }
            else if(checkDraw())
            {
                console.log("Draw");
                (async()=>{
                    await sleep(500);
                    displayController.showResult("Draw");
                   
                })();
            }
            else{
                (async()=>{
                    await sleep(500);
                    botSetp();
                })();
               
            }
        }         
    }
    const botSetp=()=>
    {
        const field=gameBoard.getEmptyfield();
        const index=field[Math.floor(Math.random()*field.length)];
        gameBoard.setField(index[0],index[1],computer);
        if(checkWinner(computer.getSign(),index[0],index[1]))
        {
            computer.updateScore();
            (async()=>{
                await sleep(500);
                displayController.updateComputerScore();
                displayController.showResult(computer.getSign());
            })();
           
            console.log("Winner Computer");
        }
        else if(checkDraw())
        {
            (async()=>{
                await sleep(500);
                displayController.showResult("Draw");
            })();
            console.log('Draw');
        }
    }
    const checkWinner=(sign,row,col)=>
    {
        let leftDiagonal=0,rightDiagonal=0,vertical=0,horizontal=0;
        let  len=gameBoard.getBoardLength();
        for(let i=0;i<len;i++)
        {
           
            if(sign==gameBoard.getFields(i,i))
            {
                leftDiagonal++;
            }
            if(sign==gameBoard.getFields(i,len-i-1))
            {
                rightDiagonal++;
            }
            if(sign==gameBoard.getFields(row,i))
            {
                  horizontal++;
            }
            if(sign==gameBoard.getFields(i,col))
            {
                vertical++;
            }
        }    
        if(leftDiagonal==len||rightDiagonal==3||vertical==3||horizontal==3)
        {
            return true;
        }   
        return false;
         
    }
    const restart=()=>
    {     
        displayController.clear();
        gameBoard.clear();
      
    }
    const checkDraw=()=>
    {
        let  len=gameBoard.getBoardLength();
        for(let i=0;i<len;i++)
        {
            for(let j=0;j<len;j++)
            {
                if(gameBoard.getFields(i,j)==="")
                {
                    return false;
                }
            }
        }
        return true;
    }
    return{
            checkWinner,
            playerStep,
            botSetp,
            restart,
            checkDraw,
            getPlayersScore,
            getBotScore
        };

})();

let displayController=(()=>
{
    const frame=document.querySelectorAll('.items');
    const restrat=document.querySelector('#restart');
    let result=document.querySelector('#player-result');
    const playerScore=document.getElementById("x-Score");
    const botScore=document.getElementById("o-Score");

    const _init=(()=>
    {
        for(let i=0;i<frame.length;i++)
        {
            let field=frame[i];
            field.addEventListener('click',()=>{
                gameController.playerStep(Math.floor(i/3),i%3)});
        }
        result.addEventListener('click',()=>
        {
            result.classList.remove('active');
            gameController.restart()
        })
        restrat.addEventListener('click',()=>{
            gameController.restart()
        });
    })();
    const showResult=(winner)=>
    {
       result.classList.add('active');
       let p=result.lastElementChild; 
       p.textContent=winner;
    }
    const updatePlayerScore=()=>
    {   
     playerScore.textContent=gameController.getPlayersScore();
    }
    const updateComputerScore=()=>{
        botScore.textContent=gameController.getBotScore();
    }
    const clear=()=>{
        frame.forEach(field=>{
            let p=field.firstElementChild;
            p.classList=[]
            p.textContent="";
        })
    }
  return{
    showResult,
    updatePlayerScore,
    updateComputerScore,
    clear
};
})();
