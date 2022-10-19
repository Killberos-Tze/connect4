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
        for (var ii=0;ii<=this.no_columns-1;ii++){
            this.row_tracker.push(this.no_rows);//this way I am at the right field which I fill in
        };

    }

    generate_divs(){
        let div = document.createElement("div");
        div.id = 'container';
        div.style.height=(32*this.no_rows+5)+'px';
        document.body.appendChild(div);

        for (var ii=0;ii<=this.no_columns-1;ii++){
            let div = document.createElement("div");
            div.className = 'column';
            div.id=ii
            div.style.height=(32*this.no_rows)+'px';
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
        this.sleep(100);
        window.location.reload()
    }

    mark_column(id){
        document.getElementById(id).style.borderWidth='2px';
        document.getElementById(id).style.borderStyle='solid';
        document.getElementById(id).style.borderColor=this.color[this.user];
    }
    demark_column(id){
        document.getElementById(id).style.borderWidth='0px';
        document.getElementById(id).style.borderStyle='';
        document.getElementById(id).style.borderColor='';
    }

    get_div_to_fill(className){
        var cur_column=document.getElementsByClassName(className)//current column class
        return cur_column[this.row_tracker[className]]
    }

    get_div_by_classes(rowName,columnName){
        var test = document.getElementsByClassName(rowName)
        return test[0].getElementsByClassName(columnName)[0]
    }

    get_div_by_index(row,col){
        var col_class=this.search_in_obj(this.column,col)
        //console.log(col_class)
        var row_class=this.search_in_obj(this.row,row)
        //console.log(row_class)
        return this.get_div_by_classes(row_class,col_class)
    }

    search_in_obj(obj,value){
        for (let key in obj){
            if (obj[key]==value){
                return key
            }
        }
    }


    check_win(id){
        var rowidx=parseInt(id.match(/^\d/))
        var columnidx=parseInt(id.match(/\d$/))
        var color_to_check = document.getElementById(id).style.backgroundColor;
        if (this.check_h(rowidx,columnidx,color_to_check)==this.win_condition || this.check_v(rowidx,columnidx,color_to_check)==this.win_condition || this.check_D1(rowidx,columnidx,color_to_check)==this.win_condition ||this.check_D2(rowidx,columnidx,color_to_check)==this.win_condition ){
            if (!alert('User '+this.winner[color_to_check]+' has won.')){this.new_game()}
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
        var cnt=1;
        while (tmpc>0 & cnt<=this.win_condition & check == document.getElementById(tmpr+'_'+Math.max(tmpc-1,0)).style.backgroundColor){
            cnt++
            tmpc--
        }
        var tmpc=columnidx;
        while (tmpc<this.no_columns-1 & cnt<=this.win_condition & check == document.getElementById(tmpr+'_'+Math.min(tmpc+1,this.no_columns-1)).style.backgroundColor){
            cnt++
            tmpc++
        }
        return cnt
    }


    check_v(rowidx,columnidx,check){
        var tmpc=columnidx;
        var tmpr=rowidx;
        var cnt=1;
        while (tmpr>0 & cnt<=this.win_condition & check == document.getElementById(Math.max(tmpr-1,0)+'_'+tmpc).style.backgroundColor){
            cnt++
            tmpr--
        }
        var tmpr=rowidx;
        while (tmpr<this.no_rows-1 & cnt<=this.win_condition & check == document.getElementById(Math.min(tmpr+1,this.no_rows-1)+'_'+tmpc).style.backgroundColor){
            cnt++
            tmpr++
        }
        return cnt
    }

    check_D1(rowidx,columnidx,check){
        var tmpc=columnidx;
        var tmpr=rowidx;
        var cnt=1;
        while (tmpc>0 & tmpr>0 & cnt<=this.win_condition & check == document.getElementById(Math.max(tmpr-1,0)+'_'+Math.max(tmpc-1,0)).style.backgroundColor){
            cnt++
            tmpc--
            tmpr--
        }
        var tmpc=columnidx;
        var tmpr=rowidx;
        while (tmpc<this.no_columns-1 & tmpr<this.no_rows-1 & cnt<=this.win_condition & check == document.getElementById(Math.min(tmpr+1,this.no_rows-1)+'_'+Math.min(tmpc+1,this.no_columns-1)).style.backgroundColor){
            cnt++
            tmpc++
            tmpr++
        }
        return cnt
    }

    check_D2(rowidx,columnidx,check){
        var tmpc=columnidx;
        var tmpr=rowidx;
        var cnt=1;
        while (tmpc>0 & tmpr<this.no_rows-1 & cnt<=this.win_condition & check == document.getElementById(Math.min(tmpr+1,this.no_rows-1)+'_'+Math.max(tmpc-1,0)).style.backgroundColor){
            cnt++
            tmpc--
            tmpr++
        }
        var tmpc=columnidx;
        var tmpr=rowidx;
        while (tmpc<this.no_columns-1 & tmpr>0 & cnt<=this.win_condition & check == document.getElementById(Math.max(tmpr-1,0)+'_'+Math.min(tmpc+1,this.no_columns-1)).style.backgroundColor){
            cnt++
            tmpc++
            tmpr--
        }
        return cnt
    }

    insert(id){
        if (this.row_tracker[parseInt(id)]>0){
        this.row_tracker[parseInt(id)]--;//I get to the row which I am filling in
        document.getElementById(this.row_tracker[parseInt(id)]+'_'+parseInt(id)).style.backgroundColor = this.color[this.user];//to pick up div that needs to change color
        this.user=(this.user+1)%2
        document.getElementById(parseInt(id)).style.borderColor=this.color[this.user];
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
