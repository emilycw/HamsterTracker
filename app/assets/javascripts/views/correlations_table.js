HamsterTracker.Views.CorrelationsTable = Backbone.CompositeView.extend({
  initialize: function(){
    // this.collection is correlations collection - fetch in previous view
  },

  template: JST['correlations_table'],

  attributes: {
    width: 700,
    height: 400
  },

  make_columns: function(){
    var hash = {};
    var that = this;
    this.collection.each(function(correlation){
      name = correlation.escape("atrb_x_name");
      if (hash[name] === undefined){
        thing = [correlation.escape("atrb_y_name"), 
          correlation.escape("atrb_y_id"), 
          correlation.escape("value")];
        hash[name] = [name, correlation.escape("atrb_x_id"), thing];
      } else {
        thing = [correlation.escape("atrb_y_name"), 
          correlation.escape("atrb_y_id"), 
          correlation.escape("value")];
        hash[name].push(thing);
      }
    })

    var columns = [];
    Object.keys(hash).forEach(function(key){
      columns.push(hash[key]);
    })
    return columns;
  },

  make_table: function(columns){
    var len = columns[0].length - 2
    var table = []
    var title = []
    columns[0].slice(2).forEach(function(atrb){
      title.unshift(atrb[0]);
    });
    title.unshift("Correlations");
    table.push(title);

    columns.forEach(function(col){
      var row = [];
      var n = 0;
      col.slice(2).forEach(function(atrb){
        row.unshift(atrb[2]);
      });
      row.unshift(col[0]);
      table.push(row);
    });
    return table;
  },

  get_color: function(x){
    var x = parseFloat(x)
    colors = ["#674172","#AEA8D3","#F2F1EF","#1BA39C","#336E7B"]
    if (isNaN(x)){
      return colors[Math.floor((colors.length)/2)];
    }
    var percent = (x + 1)/2
    var loc =  Math.floor(colors.length*percent);
    if (percent == 1){
      loc = colors.length - 1
    }
    return colors[loc];
  },

  render: function(event){
    this.renderCorrelationsTable();
    return this;
  },

  renderCorrelationsTable: function(){
    this.$el.empty();
    d3.select(this.el).append("table")
    .style("border-collapse", "collapse")
    .style("border", "2px black solid")

    var columns = this.make_columns();
    var that = this;
    var table = this.make_table(columns);
    that.renderTable(table)
  },

  renderTable: function(dataset){
    var that= this;
    var svg = d3.select(this.el);

    svg.selectAll("tr")
    .data(dataset)
    .enter().append("tr")
    
    .selectAll("td")
    .data(function(d){return d;})
    .enter().append("td")
    .style("border", "1px black solid")
    .style("padding", "10px")
    .style("background-color", function(d){return that.get_color(d);})
    .text(function(d){return d;})
    .style("font-size", "15px")
    .style("color", "black");
  }

})