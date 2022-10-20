class myinputclass{
    static test_input(id){
        //since you are working with id
        var input = document.getElementById(id).value
        var pattern=/^[5-9]$/
        var matchpattern=/^[5-9]/
        if (!pattern.test(input)){
            document.getElementById(id).value=input.match(matchpattern);
        }    
    }

    static get_value(id){
        return parseInt(document.getElementById(id).value)
    }

    static generate_game(){
        var no_rows=myinputclass.get_value('rows')
        var no_columns=myinputclass.get_value('columns')
        if (!isNaN(no_rows)&!isNaN(no_columns)){
            document.body.innerHTML = ""
            //extremenly important!!!!
            window.myglobal_a=new mygameclass(no_rows,no_columns);//constant reference to the gameclass
        }
    }
}

class mygameclass{
    constructor(no_rows,no_columns){
        this.win_condition=4;
        this.no_rows=no_rows;
        this.no_columns=no_columns;
        this.generate_divs();
        this.user=1;
        this.color=['red','blue'];
        this.winner={}
        this.winner[this.color[0]]='Red PLayer';
        this.winner[this.color[1]]='Blue Player';
        this.row_tracker=[];
        this.imageclickbutton='url("./images/go_back_click.png")';
        for (var ii=0;ii<=this.no_columns-1;ii++){
            this.row_tracker.push(this.no_rows);//this way I am at the right field which I fill in
        };

    }

    generate_divs(){
        let div = document.createElement("div");
        div.id = 'container';
        div.style.height=(30*this.no_rows+5)+'px';//5 is added to compensate for the border change
        document.body.appendChild(div);

        for (var ii=0;ii<=this.no_columns-1;ii++){
            let div = document.createElement("div");
            div.className = 'column';
            div.id=ii
            div.style.height=(30*this.no_rows)+'px';
            div.setAttribute("type", "button");
            div.setAttribute("onclick", "window.myglobal_a.main_insert(id)");
            div.setAttribute("onmouseover", "window.myglobal_a.mark_column(id)");
            div.setAttribute("onmouseout", "window.myglobal_a.demark_column(id)");
            document.getElementById('container').appendChild(div);
            for (var jj=0;jj<=this.no_rows-1;jj++){
                let div = document.createElement("div");
                div.className = 'field';
                div.id=jj+'_'+ii
                document.getElementById(ii).appendChild(div);
            }
        }
        let divb= document.createElement("div");
        divb.id='return';
        divb.setAttribute("type", "button")
        divb.setAttribute("onclick", "window.myglobal_a.go_back(id)")
        document.body.appendChild(divb);
    }

        //not sure is it working
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    go_back(id){
        document.getElementById(id).style.backgroundImage=this.imageclickbutton;
        this.sleep(200).then(() => {
            window.location.reload()
            })
    }

    mark_column(id){
        document.getElementById(id).style.borderWidth='2px';
        document.getElementById(id).style.borderStyle='solid';
        document.getElementById(id).style.borderColor=this.color[this.user];
    }
    demark_column(id){
        document.getElementById(id).style.borderWidth='0px';
    }


    sum(array){
        var sum=0;
        for (var i=0;i<array.length;i++){
            sum=sum+array[i];
        }
        return sum
    }
    //image overlapping
    mark_winning_combination(id_list,direction){
        for (var item of id_list){
            if (document.getElementById(item).style.backgroundImage==''){
                document.getElementById(item).style.backgroundImage="url('./images/"+direction+".png')"
            }else{
                document.getElementById(item).style.backgroundImage=document.getElementById(item).style.backgroundImage+", url('./images/"+direction+".png')"
            }
            
        }

    }

    check_win(id){
        var flag;
        var rowidx=parseInt(id.match(/^\d/))
        var columnidx=parseInt(id.match(/\d$/))
        var color_to_check = document.getElementById(id).style.backgroundColor;
        var res_h=this.check_h(rowidx,columnidx,color_to_check)
        var res_v=this.check_v(rowidx,columnidx,color_to_check)
        var res_D1=this.check_D1(rowidx,columnidx,color_to_check)
        var res_D2=this.check_D2(rowidx,columnidx,color_to_check)
        if (res_h[0]==this.win_condition){
            flag=1
            this.mark_winning_combination(res_h[1],'horizontal')
        }
        if (res_v[0]==this.win_condition){
            flag=1
            this.mark_winning_combination(res_v[1],'vertical')
        }
        if (res_D1[0]==this.win_condition){
            flag=1
            this.mark_winning_combination(res_D1[1],'D_up')
        }
        if (res_D2[0]==this.win_condition){
            flag=1
            this.mark_winning_combination(res_D2[1],'D_down')
        }
        
        if (flag==1){
            this.sleep(200).then(() => {
                if (!alert('User '+this.winner[color_to_check]+' has won.')){this.new_game()}//issues with alert in new version of firefox
                })
            
        }else if (this.sum(this.row_tracker)==0){
            this.sleep(200).then(() => {
                if (!alert('There is no winner.')){this.new_game()}//issues with alert in new version of firefox
                })
        }
    }

    new_game(){
        document.body.innerHTML = ""
            //extremenly important!!!!
        window.myglobal_a=new mygameclass(this.no_rows,this.no_columns);
    }

    check_h(rowidx,columnidx,check){
        var tmpc=columnidx;
        var tmpr=rowidx;
        var idlist=[]
        idlist.push(tmpr+'_'+tmpc)
        var cnt=1;
        while (tmpc>0 & cnt<=this.win_condition & check == document.getElementById(tmpr+'_'+Math.max(tmpc-1,0)).style.backgroundColor){
            cnt++
            tmpc--
            idlist.push(tmpr+'_'+tmpc)
        }
        var tmpc=columnidx;
        while (tmpc<this.no_columns-1 & cnt<=this.win_condition & check == document.getElementById(tmpr+'_'+Math.min(tmpc+1,this.no_columns-1)).style.backgroundColor){
            cnt++
            tmpc++
            idlist.push(tmpr+'_'+tmpc)
        }
        return [cnt,idlist]
    }


    check_v(rowidx,columnidx,check){
        var tmpc=columnidx;
        var tmpr=rowidx;
        var idlist=[]
        idlist.push(tmpr+'_'+tmpc)
        var cnt=1;
        while (tmpr>0 & cnt<=this.win_condition & check == document.getElementById(Math.max(tmpr-1,0)+'_'+tmpc).style.backgroundColor){
            cnt++
            tmpr--
            idlist.push(tmpr+'_'+tmpc)
        }
        var tmpr=rowidx;
        while (tmpr<this.no_rows-1 & cnt<=this.win_condition & check == document.getElementById(Math.min(tmpr+1,this.no_rows-1)+'_'+tmpc).style.backgroundColor){
            cnt++
            tmpr++
            idlist.push(tmpr+'_'+tmpc)
        }
        return [cnt,idlist]
    }

    check_D1(rowidx,columnidx,check){
        var tmpc=columnidx;
        var tmpr=rowidx;
        var idlist=[]
        idlist.push(tmpr+'_'+tmpc)
        var cnt=1;
        while (tmpc>0 & tmpr>0 & cnt<=this.win_condition & check == document.getElementById(Math.max(tmpr-1,0)+'_'+Math.max(tmpc-1,0)).style.backgroundColor){
            cnt++
            tmpc--
            tmpr--
            idlist.push(tmpr+'_'+tmpc)
        }
        var tmpc=columnidx;
        var tmpr=rowidx;
        while (tmpc<this.no_columns-1 & tmpr<this.no_rows-1 & cnt<=this.win_condition & check == document.getElementById(Math.min(tmpr+1,this.no_rows-1)+'_'+Math.min(tmpc+1,this.no_columns-1)).style.backgroundColor){
            cnt++
            tmpc++
            tmpr++
            idlist.push(tmpr+'_'+tmpc)
        }
        return [cnt,idlist]
    }

    check_D2(rowidx,columnidx,check){
        var tmpc=columnidx;
        var tmpr=rowidx;
        var idlist=[]
        idlist.push(tmpr+'_'+tmpc)
        var cnt=1;
        while (tmpc>0 & tmpr<this.no_rows-1 & cnt<=this.win_condition & check == document.getElementById(Math.min(tmpr+1,this.no_rows-1)+'_'+Math.max(tmpc-1,0)).style.backgroundColor){
            cnt++
            tmpc--
            tmpr++
            idlist.push(tmpr+'_'+tmpc)
        }
        var tmpc=columnidx;
        var tmpr=rowidx;
        while (tmpc<this.no_columns-1 & tmpr>0 & cnt<=this.win_condition & check == document.getElementById(Math.max(tmpr-1,0)+'_'+Math.min(tmpc+1,this.no_columns-1)).style.backgroundColor){
            cnt++
            tmpc++
            tmpr--
            idlist.push(tmpr+'_'+tmpc)
        }
        return [cnt,idlist]
    }

    insert(id){
        if (this.row_tracker[parseInt(id)]>0){
        this.row_tracker[parseInt(id)]--;//I get to the row which I am filling in
        document.getElementById(this.row_tracker[parseInt(id)]+'_'+parseInt(id)).style.backgroundColor = this.color[this.user];//to pick up div that needs to change color
        this.user=(this.user+1)%2
        this.sleep(200).then(() => {
            document.getElementById(parseInt(id)).style.borderColor=this.color[this.user];//a bit of delay
            })
        //console.log(this.row)
        return 0
        }else{
            return 1
        }
    }


    main_insert(id){
        let insert_finish=this.insert(id);
        if (insert_finish==0){
            this.check_win(this.row_tracker[parseInt(id)]+'_'+parseInt(id));//rowtracker is where the field was colored
        }
    }

}

