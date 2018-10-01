import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import $ from "jquery"

class Header extends Component {
    render(){
        return (
            <header>
                <a href={"https://www.freecodecamp.com"}>
                    <img className={"fcclogo"}
                    src={"https://s3.amazonaws.com/freecodecamp/freecodecamp_logo.svg"}
                    alt={"FreeCodeCamp logo"}/>
                </a>
            </header>
        );
    }
}

class ColumnHeadings extends Component {
    render(){
        return (
            <thead>
            <tr id={"colheaders"} className={"top100"}>
                <th className={"idcol"}>#</th>
                <th>Camper Name</th>
                <th id={"defaultsort"}
                    className={"sortable sorted true"}
                    onClick={this.handleClickNum.bind(this,"recent")}>Points in past 30 days</th>
                <th className={"sortable"} onClick={this.handleClickNum.bind(this,"alltime")}>
                    All time points
                </th>
            </tr>
            </thead>
        );
    }

    removeSortClasses() {
        var nodes = document.getElementsByClassName('sortable');
        for (var i = 0; i < nodes.length; i++) {
            nodes.item(i).className = "sortable";
        }
    }

    handleClickNum(fieldname,event){
        if (!event.target.classList.contains('sorted')) {
            this.removeSortClasses();
            event.target.className = "sortable sorted true";
            this.props.sortTableNum(fieldname);
        }
    }
}

class User extends Component {
    render() {
        return (
            <tr className={"top100"}>
                <td className={"idcol"}>{this.props.count}</td>
                <td>
                    <a href={"https://www.freecodecamp.com/"+this.props.user.uername}
                        target={"_blank"}>
                        <img src={this.props.user.img} className={"userimg"}/>
                        <span>{this.props.user.username}</span>
                    </a>
                </td>
                <td className={"numbercol"}>{this.props.user.recent}</td>
                <td className={"numbercol"}>{this.props.user.alltime}</td>
            </tr>
        );
    }
    handleClickUpdateUser() {//这个函数干什么用的？
        $.get( this.props.apiroot+"update/"+this.props.user.username,
            function( data ) {
                setTimeout(this.props.updatePage,3000);
            }.bind(this)
        )
            // .fail(function() {
            //     console.error(this.props.apiroot, status, err.toString());
            // }
            // );
    }
}

class Leaderboard extends React.Component { //props.users.map(function)是什么
    render() {
        var count = 0;
        var userlist = this.props.users.map(function(user){
            count++;
            return (
                <User user={user} key={user.username} count={count}
                      apiroot={this.props.apiroot} updatePage={this.props.updatePage}/>
            );
        }.bind(this)
        );
        return (
            <table className="table table-striped table-bordered">
                /*用props传递一个函数*/
                <ColumnHeadings sortTableNum={this.props.sortTableNum}/>
                <tbody>
                {userlist}
                </tbody>
            </table>
        );
    }
}

class Body extends Component {
    constructor(){
        super();
        this.state = {
            users: [],
            reverse: true,
            column: "recent"
        }
    }
    getData() {
        $.ajax({    //jquery 读取ajax
            url: this.props.apiroot + "top/" + this.state.column,
            dataType: "json",
            cache: false,
            success: function (data) {
                var users = data;
                this.setState({users: users});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.apiroot, status, err.toString());
            }.bind(this)
        });
    }
    componentDidMount(){
        this.getData();
    }
    render(){
        return(
            <div className={"container"}>
                <div className={"row"}>
                    <div className={"col-lg-12"}>
                        <div id={"header"}>
                            <h3>Leaderboard</h3>
                        </div>
                    </div>
                </div>
                <div className={"row"}>
                    <div className={"col-lg-12"}>
                        <Leaderboard
                            users={this.state.users}
                            apiroot = {this.props.apiroot}
                            updatePage={this.getData.bind(this)}
                            sortTableNum={this.sortTableNum.bind(this)} //用props传递一个函数
                        />
                    </div>
                </div>
            </div>
        );
    }
    removeSortClasses() {
        var nodes = document.getElementsByClassName('sortable');
        for (var i = 0; i < nodes.length; i++) {
            nodes.item(i).className = "sortable";
        }
    }
    sortTableNum(column){
        if (column!==this.state.column){
            this.setState({reverse: true, column: column}, this.getData);
        }
    }
}


class App extends Component {
  render() {
    return (

      <div>
          <Header/>
          <Body apiroot={this.props.apiroot}/>
      </div>
  );
  }
}

export default App;
