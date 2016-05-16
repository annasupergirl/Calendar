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
		var params = getParams(window.location.search);

		return {
			day: params['day'],
			month: params['month'],
			year: params['year'],
			items: [],
			task: '',
			textTaskIsEmpty: true
		}
	},

	componentWillMount: function() {
		var self = this,
		    day = this.state.day,
		    month = this.state.month,
		    year = this.state.year,
		    xhr = new XMLHttpRequest();
		xhr.open("GET", "php/select_task.php?day=" + day + "&month=" + month + "&year=" + year, true);
		xhr.onload = function() {
			if(xhr.responseText) {
				var array_tasks = JSON.parse(xhr.responseText);
				var res = [];
				for(var i = 0; i < array_tasks.length; i++) {
					res.push(array_tasks[i].task);
				}
				self.setState({ items: res });
			} else {
				self.setState({ items: [] });
			}
		};
		xhr.onerror = function() {
			alert(this.status, this.statusText);
		}
		xhr.send();
	},

	onChange: function(e) {
		if (e.target.value.trim().length > 0) {
			this.setState({textTaskIsEmpty: false, task: e.target.value});
		} else {
			this.setState({textTaskIsEmpty: true});
		}
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

	addTask: function (e) {
		var task = this.state.task;

		this.setState({
			items: this.state.items.concat([task]),
			task: '',
			textTaskIsEmpty: true,
		});
		e.preventDefault();

		var day = this.state.day,
		    month = this.state.month,
		    year = this.state.year,
		    xhr = new XMLHttpRequest();

		xhr.open("GET", "php/insert_task.php?task=" + task + "&day=" + day + "&month=" + month + "&year=" + year, true);
		xhr.onload = function() {
			alert("Данные успешно добавлены");
		};
		xhr.onerror = function() {
			alert(this.status, this.statusText);
		};
		xhr.send();
	},

	deleteTask: function(e) {
		var taskIndex = parseInt(e.target.value, 10);
		this.setState(function(state) {
			state.items.splice(taskIndex, 1);
			return {items: state.items};
		});

		var xhr = new XMLHttpRequest(),
		    task = this.state.items[taskIndex];

		xhr.open("GET", "php/delete_task.php?task=" + task, true);
		xhr.onload = function() {
			alert("Данные успешно удалены");
		};
		xhr.onerror = function() {
			alert(this.status, this.statusText);
		}
		xhr.send();
	},

	onClickButton: function(event) {
		window.location = "calendar.html?month=" + this.state.month + "&year=" + this.state.year;
	}
});

ReactDOM.render(
	<TaskApp />,
	document.getElementById('my_tasksForDay')
);
