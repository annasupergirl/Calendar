var TaskList = React.createClass({
	render: function() {
		var liWithTask,
		    deleteTask = this.props.deleteTask;

		liWithTask = this.props.items.map(function(task, taskIndex) {
			return (
				<li key={taskIndex} className='task'>
					<p>{task}</p>
					<button onClick={deleteTask} value={taskIndex} className='deleteBtn'> X </button>
				</li>
			)
		});

		return (
			<ul>
				{liWithTask}
			</ul>
		);
	}
});

var TaskApp = React.createClass({
	getInitialState: function() {
		return {
			items: [],
			task: '',
			textTaskIsEmpty: true
		}
	},

	componentWillMount: function() {
		var self = this;
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "php/select_task.php", true);
		xhr.onload = function() {
			if(xhr.responseText) {
				var array_tasks = JSON.parse(xhr.responseText);
				self.setState({ items: array_tasks });
			} else {
				self.setState({ items: [] });
			}
		};
		xhr.onerror = function() {
			console.log(this.status, this.statusText);
		}
		xhr.send();
	},

	deleteTask: function(e) {
		var taskIndex = parseInt(e.target.value, 10);
		this.setState(function(state) {
			state.items.splice(taskIndex, 1);
			return {items: state.items};
		});
	},

	onChange: function(e) {
		if (e.target.value.trim().length > 0) {
			this.setState({textTaskIsEmpty: false, task: e.target.value});
		} else {
			this.setState({textTaskIsEmpty: true});
		}
	},

	addTask: function (e) {
		this.setState({
			items: this.state.items.concat([this.state.task]),
			task: '',
			textTaskIsEmpty: true,
		});
		e.preventDefault();
	},

	render: function() {
		return (
			<div>
				<h1>Задачи на день: </h1>
				<TaskList items={this.state.items} deleteTask={this.deleteTask} />
				<form onSubmit={this.addTask} className='add task'>
					<input onChange={this.onChange} type="text" value={this.state.task}/>
					<button className='add__btn' disabled={this.state.textTaskIsEmpty}>Добавить задачу</button>
				</form>
				<button className='add__btn' onClick={this.onClickButton}>Назад</button>
			</div>
		);
	},

	onClickButton: function(event) {
		var items = this.state.items;

		if(items.length > 0) {
			var jsonData = "items=" + JSON.stringify({ items }),
			    xhr = new XMLHttpRequest();

			xhr.open("POST", "php/insert_task.php", true);
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.onload = function() {
				window.location = "calendar.html";
			};
			xhr.onerror = function() {
				console.log(this.status, this.statusText);
			}
			xhr.send(jsonData);
		} else {
			var xhr = new XMLHttpRequest();

			xhr.open("GET", "php/delete_task.php", true);
			xhr.onload = function() {
				window.location = "calendar.html";
			};
			xhr.onerror = function() {
				console.log(this.status, this.statusText);
			}
			xhr.send();
		}
	}
});

ReactDOM.render(
	<TaskApp />,
	document.getElementById('my_tasksForDay')
);
