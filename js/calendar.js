var daysOfWeek = [
{ day: "пн" },
{ day: "вт" },
{ day: "ср" },
{ day: "чт" },
{ day: "пт" },
{ day: "сб" },
{ day: "вс" }
];

var DaysWeek = React.createClass({
	render: function() {
		var day = this.props.data.day;
		return (
			<th className="days__week">{day}</th>
		);
	}
});

var AllDays = React.createClass({
	getInitialState: function() {
		if(this.props.month_prop && this.props.year_prop) {
			return {
				month: this.props.month_prop,
				year: this.props.year_prop,
				today_month: this.calendar(this.props.year_prop, this.props.month_prop)
			};
		} else {
			var today_date = new Date();
			return {
				month: today_date.getMonth(),
				year: today_date.getFullYear(),
				today_month: this.calendar(today_date.getFullYear(), today_date.getMonth())
			};
		}
	},

	componentWillMount: function() {
		var self = this;
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "php/select_calendar.php?month=" + this.state.month + "&year=" + this.state.year, true);
		xhr.onload = function() {
			if(xhr.responseText) {
				var array_days = JSON.parse(xhr.responseText);
				var res = [];
				for(var j = 0; j < array_days.length; j++) {
					res.push(array_days[j]['day']);
				}
				self.setState({ today_month: self.calendar(self.state.year, self.state.month, res) });
			} else {
				self.setState({ today_month: self.calendar(self.state.year, self.state.month, []) });
			}
		};
		xhr.onerror = function() {
			console.log(this.status, this.statusText);
		}
		xhr.send();
	},

	workAjax: function(year, month) {
		var self = this;
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "php/select_calendar.php?month=" + month + "&year=" + year, true);
		xhr.onload = function() {
			if(xhr.responseText) {
				var array_days = JSON.parse(xhr.responseText);
				var res = [];
				for(var j = 0; j < array_days.length; j++) {
					res.push(array_days[j]['day']);
				}
				self.setState({ today_month: self.calendar(year, month, res) });
			} else {
				self.setState({ today_month: self.calendar(year, month, []) });
			}
		};
		xhr.onerror = function() {
			console.log(this.status, this.statusText);
		}
		xhr.send();
	},

	onClickCalendar: function(event) {
		var target = event.target,
		    leftArrow = document.querySelector('.last_td:nth-child(1) div'),
		    rightArrow = document.querySelector('.last_td:nth-child(5) div');

		if(target == leftArrow) {
			event.preventDefault();
			this.setState({ month: --this.state.month, year: this.state.year });
			this.workAjax(this.state.year, this.state.month);
			if(this.state.month == 0) {
				this.workAjax(this.state.year, this.state.month);
				this.setState({ month: 12, year: --this.state.year });
			}
		} else if(target == rightArrow) {
			this.setState({ month: ++this.state.month, year: this.state.year });
			this.workAjax(this.state.year, this.state.month);
			if(this.state.month == 11) {
				this.workAjax(this.state.year, this.state.month);
				this.setState({ month: -1, year: ++this.state.year });
			}
			event.preventDefault();
		}
		window.month = this.state.month;
		window.year = this.state.year;
	},

	getRandomInt: function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	findDay: function (array, value) {
		for (var i = 0; i < array.length; i++) {
			if (array[i] == value) {
				return i;
			}
		}
		return -1;
	},

	calendar: function(year, month, array_day) {
		var dayCount = new Date(year, month + 1, 0).getDate(), // последний день месяца
		    daylast = new Date(year, month, dayCount).getDay(), // день недели последнего дня месяца
		    dayfirst = new Date(year, month, 1).getDay(), // день недели первого дня месяца
		    fullMonth = new Date(year, month, dayCount),
		    arrWithTd = [],
		    resultWithTr = [],
		    months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
		    randKey = this.getRandomInt(1, 1010);

		if(dayfirst == 0) {
			dayfirst = 7;
		}
// пустые клетки до первого дня текущего месяца
		if (dayfirst != 0) {
			for(var i = 1; i < dayfirst; i++) {
				arrWithTd.push(<td key={randKey+i*dayfirst}></td>);
			}
		}
// дни месяца
		for (var i = 1; i <= dayCount; i++) {
			if (i == new Date().getDate() && fullMonth.getFullYear() == new Date().getFullYear() && fullMonth.getMonth() == new Date().getMonth() && array_day != undefined && this.findDay(array_day, i) != -1) {
				arrWithTd.push(<td key={i} className="today click_day">{i}</td>);
			} else if(i == new Date().getDate() && fullMonth.getFullYear() == new Date().getFullYear() && fullMonth.getMonth() == new Date().getMonth()) {
				arrWithTd.push(<td key={i} className="today">{i}</td>);
			} else if(array_day != undefined && this.findDay(array_day, i) != -1) {
				arrWithTd.push(<td key={i+44+randKey} className="click_day">{i}</td>);
			} else {
				arrWithTd.push(<td key={i}>{i}</td>);
			}
			if (arrWithTd.length == 7) {
				resultWithTr.push(<tr key={i+randKey}>{arrWithTd}</tr>);
				arrWithTd = [];
			}
		}
// пустые клетки до последнего дня текущего месяца
		if(arrWithTd.length > 0) {
			for (var i = arrWithTd.length; i <= 6; i++) {
				arrWithTd.push(<td key={arrWithTd.length*randKey}></td>);
			}
			resultWithTr.push(<tr key={arrWithTd.length}>{arrWithTd}</tr>);
			arrWithTd = [];
		}
// стрелочки, год, месяц
		for (var i = 1; i <= 5; i++) {
			if (i == 2) {
				arrWithTd.push(<td key={i+arrWithTd.length+1000} colSpan="2" className="last_td">{months[month]}</td>);
			} else if (i == 3) {
				arrWithTd.push(<td key={i+arrWithTd.length+1000} colSpan="2" className="last_td">{year}</td>);
			}
			arrWithTd.push(<td key={i+arrWithTd.length+1000} className="last_td"><div></div></td>);
			if (arrWithTd.length == 5) {
				resultWithTr.push(<tr key={resultWithTr.length+500}>{arrWithTd}</tr>);
				arrWithTd = [];
			}
		}
		return resultWithTr;
	},

	render: function() {
		var today_month = this.state.today_month;

		return (
			<tbody onClick={this.onClickCalendar} id="tbody_table">
				{today_month}
			</tbody>
		);
	}
});

var AppForCalendar = React.createClass({
	render: function() {
		var data = this.props.data,
		    month = reactCookie.load('month'),
		    year = reactCookie.load('year'),
		    daysTemplate;

		daysTemplate = data.map(function(item, index) {
			return (
				<DaysWeek key={index} data={item} />
			);
		});

		if(month == false && year == false) {
			return (
				<table id='daysTable' onClick={this.onClickTable}>
					<thead>
						<tr>
							{daysTemplate}
						</tr>
					</thead>
					<AllDays />
				</table>
			);
		} else {
			return (
				<table id='daysTable' onClick={this.onClickTable}>
					<thead>
						<tr>
							{daysTemplate}
						</tr>
					</thead>
					<AllDays year_prop={year} month_prop={month}/>
				</table>
			);
		}
	},

	onClickTable: function(event) {
		var target = event.target;

		if (target.tagName != 'TD' || (target.tagName === 'TD' && target.innerHTML.length === 0) || target.className == "last_td") {
			return;
		} else {
			reactCookie.save('day', target.innerHTML);
			reactCookie.save('month', month);
			reactCookie.save('year', year);
			window.location = "tasks.html";
		}
	}
});

ReactDOM.render(
	<AppForCalendar data={daysOfWeek}/>,
	document.getElementById('my_calendar')
);
