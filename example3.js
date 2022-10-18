class myinputclass{
    static test_input(id){
        //since you are working with id
        var input = document.getElementById(id).value
        var pattern=/^\d+$/
        var matchpattern=/^\d+/
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
        this.no_rows=no_rows;
        this.no_columns=no_columns;
        this.generate_divs();
        this.user=1;
        this.color=['red','blue'];
        this.row_tracker={};
        for (var ii=1;ii<=this.no_columns;ii++){
            this.row_tracker['column'+ii]=this.no_rows;
        };
        this.row={};
        for (var ii=1;ii<=this.no_rows;ii++){
            this.row['row'+ii]=ii-1;
        };
        this.column={}
        for (var ii=1;ii<=this.no_columns;ii++){
            this.column['column'+ii]=ii-1;
        };

    }

    generate_divs(){
        for (var ii=1;ii<=this.no_rows;ii++){
            let div = document.createElement("div");
            div.className = 'row'+ii;
            div.style.display='flex';
            div.style.width=(30*this.no_columns)+'px';
            div.style.height='30px'
            document.body.appendChild(div);
            for (var jj=1;jj<=this.no_columns;jj++){
                let div = document.createElement("div");
                div.className = 'column'+jj;
                div.style.width='30px'
                div.style.height='100%'
                div.style.border='solid';
                div.style.borderWidth='1px';
                document.body.getElementsByClassName('row'+ii)[0].appendChild(div);
            }
        }
        let div = document.createElement("div");
        div.className = 'row'+(this.no_rows+1);
        div.style.width=(30*this.no_columns)+'px'
        div.style.height='30px'
        div.style.display='flex';
        document.body.appendChild(div);
        for (var jj=1;jj<=this.no_columns;jj++){
            var button = document.createElement("INPUT");
            button.setAttribute("type", "button");
            button.className = 'column'+jj;
            button.style.width='30px'
            button.style.height='100%'
            button.setAttribute("onclick", "window.myglobal_a.main_insert(className)");;
            document.body.getElementsByClassName('row'+ii)[0].appendChild(button);
        }
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


    check_win(){
        var rowidx=this.row_tracker[this.col_name];
        var columnidx=this.column[this.col_name];
        var color_to_check = this.get_div_by_index(rowidx,columnidx).style.backgroundColor; 
        if (this.check_h(rowidx,columnidx,color_to_check)==4 || this.check_v(rowidx,columnidx,color_to_check)==4 || this.check_D1(rowidx,columnidx,color_to_check)==4 ||this.check_D2(rowidx,columnidx,color_to_check)==4 ){
            if (!alert('User '+color_to_check+' has won.')){window.location.reload()}
        }
    }

    check_h(rowidx,columnidx,color_to_check){
        
        var tmp=columnidx;

        var cnt=1;
        while (tmp>0 & cnt<=4 & color_to_check == this.get_div_by_index(rowidx,Math.max(tmp-1,0)).style.backgroundColor){
            cnt++
            tmp--
        }
        var tmp=columnidx;
        while (tmp<this.no_columns-1 & cnt<=4 & color_to_check == this.get_div_by_index(rowidx,Math.min(tmp+1,this.no_columns-1)).style.backgroundColor){
            cnt++
            tmp++
        }
        
        return cnt
    }


    check_D1(rowidx,columnidx,color_to_check){
        var tmpc=columnidx;
        var tmpr=rowidx;
        var cnt=1;
        while (tmpc>0 & tmpr>0 & cnt<=4 & color_to_check == this.get_div_by_index(Math.max(tmpr-1,0),Math.max(tmpc-1,0)).style.backgroundColor){
            cnt++
            tmpc--
            tmpr--
        }
        var tmpc=columnidx;
        var tmpr=rowidx;
        while (tmpc<this.no_columns-1 & tmpr<this.no_rows-1 & cnt<=4 & color_to_check == this.get_div_by_index(Math.min(tmpr+1,this.no_rows-1),Math.min(tmpc+1,this.no_columns-1)).style.backgroundColor){
            cnt++
            tmpc++
            tmpr++
        }
        return cnt
    }

    check_D2(rowidx,columnidx,color_to_check){
        var tmpc=columnidx;
        var tmpr=rowidx;
        var cnt=1;
        while (tmpc>0 & tmpr<this.no_rows-1 & cnt<=4 & color_to_check == this.get_div_by_index(Math.min(tmpr+1,this.no_rows-1),Math.max(tmpc-1,0)).style.backgroundColor){
            cnt++
            tmpc--
            tmpr++
        }
        var tmpc=columnidx;
        var tmpr=rowidx;
        while (tmpc<this.no_columns-1 & tmpr>0 & cnt<=4 & color_to_check == this.get_div_by_index(Math.max(tmpr-1,0),Math.min(tmpc+1,this.no_columns-1)).style.backgroundColor){
            cnt++
            tmpc++
            tmpr--
        }
        return cnt
    }


    check_v(rowidx,columnidx,color_to_check){
        var tmp=rowidx;
        var cnt=1;
        while (tmp>0 & cnt<=4 & color_to_check == this.get_div_by_index(Math.max(tmp-1,0),columnidx).style.backgroundColor){
            cnt++
            tmp--
        }
        var tmp=rowidx;
        while (tmp<this.no_rows-1 & cnt<=4 & color_to_check == this.get_div_by_index(Math.min(tmp+1,this.no_rows-1),columnidx).style.backgroundColor){
            cnt++
            tmp++
        }
        return cnt
    }

    insert(){
        if (this.row_tracker[this.col_name]>0){
        this.row_tracker[this.col_name]--
        this.get_div_to_fill(this.col_name).style.backgroundColor = this.color[this.user];//to pick up div that needs to change color
        this.user=(this.user+1)%2
        //console.log(this.row)
        return 0
        }else{
            return 1
        }
    }


    main_insert(className){
        this.col_name=className
        let insert_finish=this.insert();
        /* if (insert_finish==0){
            console.log(className, this.a.row_tracker)
        } */
        if (insert_finish==0){
            this.check_win()
        }
    }

}

