HamsterTracker.Views.MainGraph = Backbone.CompositeView.extend({

  initialize: function(options){
    this.dataPointsList = options.dataPointsList;
    var that = this;
    this.width = 600;
    this.height = 400;
  },

  template: JST['main_graph'],

  // tagName:"div",
  tagName:"svg",

  attributes: {
    width: 600,
    height: 400,
  },

  className:"main-graph",

  nameSpace: "http://www.w3.org/2000/svg",

// ---------------------------------- Setup ------------------------

  // Takes data point collection and returns a list a data points for it
  convertDataPointsColl: function(dataPoints){
    var dataList = [];
    var that = this;
    dataPoints.fetch({
      success: function(){
        dataPoints.each(function(dataPoint){
          var time = dataPoint.time();
          ids = [dataPoint.get("tracking_attribute_id"), dataPoint.get("id")]
          dataList.push([time,dataPoint.get("value"),ids])

          if (!that.minD || that.minD < time){
            that.minD = time
          }

          if (!that.maxD || that.maxD > time){
            that.maxD = time
          }
        });
        that.toDo -= 1;
        that.dataListList.push(dataList);
        that.renderGraphHandler();
      }
    })
  },

// ---------------------------------- Render -----------------------
  render: function(){
    var that = this;
    this.dataListList = [];
    this.toDo = this.dataPointsList.length;
    this.dataPointsList.forEach(function(dataPoints){
      that.convertDataPointsColl(dataPoints);
    });
  },

  renderGraphHandler: function(){
    if (this.toDo > 0){
      return null;
    }
    var that = this;
    this.dataListList.forEach(function(dataList){
      that.renderGraph(dataList);
    });
  },


  randomColor: function () {
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += "0123456789ABCDEF"[Math.floor((Math.random() * 16))];
    }
    return color;
  },

  renderGraph: function(dataList){
    var svg = d3.select(this.el);
    var dataset = dataList;
    var padding = 30

    var minD = this.minD;
    var maxD = this.maxD;

    // var minD = new Date("2015-07-29T03:03:00.000Z");
    // var maxD = new Date("2015-08-16T03:03:00.000Z");
    var xscale =  d3.time.scale()
    .domain([minD, maxD])
    .range([padding, this.width-padding]);

    var yscale = d3.scale.linear()
    .domain([d3.min(dataset, function(d) { return d[1]; })-1, d3.max(dataset, function(d) { return d[1]; })+1])
    .range([this.height - padding, padding]);

    var xAxis = d3.svg.axis()
    .scale(xscale)
    .orient("bottom")
    .ticks(5);

    var yAxis = d3.svg.axis()
    .scale(yscale)
    .orient("left");

    var col = this.randomColor();

    svg.selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("cx", function(d) {
        return xscale(d[0]);
      })
      .attr("cy", function(d) {
        return yscale(d[1]);
      })
      .attr("r", 5)      
      .attr("data-tsId",function(d) {
        return d[2][0];
      })
      .attr("data-dpId",function(d) {
        return d[2][1];
      })
      .attr("fill",col);

    svg.append("g")
      .attr("transform", "translate(0,"+(this.height-padding)+")")
      .attr("class", "axis")
      .call(xAxis)
    ;

    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + padding + ",0)")
      .call(yAxis);
    return this;
  },

  // Originally from http://nocircleno.com/blog/svg-with-backbone-js/
  _ensureElement: function() {
     if (!this.el) {
        var attrs = _.extend({}, _.result(this, 'attributes'));
        if (this.id) attrs.id = _.result(this, 'id');
        if (this.className) attrs['class'] = _.result(this, 'className');
        var $el = $(window.document.createElementNS(_.result(this, 'nameSpace'), _.result(this, 'tagName'))).attr(attrs);
        this.setElement($el, false);
     } else {
        this.setElement(_.result(this, 'el'), false);
     }
  }
})
