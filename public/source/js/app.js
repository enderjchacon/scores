Vue.directive("color", {
  "bind": function(){
    console.log("directiva activa");
  },

  "unbind": function(){
    console.log("directiva desactivada");
  },

  //Función que se ejecuta cada vez que la variable color se actualiza.
  "update": function(el, biding,vnode,oldvnode){

    if(biding.value!=biding.oldValue){
      console.log('cambio',biding.value,biding.oldValue)
      el.style.background ='#ffc08c';
    }else{
      el.style.background ='#f3f3fe';
    }
  }
});

Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://170.75.251.46:10000',
}))

const app = new Vue({

  data() {
    return{
      response: [],
      screnWidth: window.screen.width,
      navigationShow:true,
      colsSlideWidth:11,
      colsDateWidth:1,
      day:0,
      year:0,
      month:0,
      nameMonth:"",
      objDate:new Date(),
      today: 0,
      objNow:new Date(),
      isToday:true,
      dataLive:[],
      isLive: false, 
      displayPreloader:'none',
      league:'MLB',
      showCalendar: false,
      datepicker:new Date(),
      es: vdp_translation_es.js
    }
  },
  props:[
    'perPageCustom',
    'navigationenabled',
    'paginationEnabled'
  ],
  components: {
  	'carousel': VueCarousel.Carousel,
    'slide': VueCarousel.Slide,
    'datepicker':vuejsDatepicker
  },

  methods:{
    getDataGames: function (league) {

      this.getDate();
      console.log(this.today)
      switch (league) {
        case 'MLB':
          this.getDataMLB(this.today)
        break;
      
        case 'LVBP':
          this.getDataLVBP(this.today)
        break;
      }
      this.league = league;
    },
    getDataMLB: function(today){
      this.displayPreloader = 'block'
      axios
      .get('http://170.75.251.46:10000/api/mlb/getGames', {
        params:{
          'date':today
        }
      })
      .then(response => {
        this.response = response.data;
        this.displayPreloader = 'none'
  
        this.startRefreshData();
      })
      
    },
    getDataLVBP: function (today) {

      this.displayPreloader = 'block'
      axios
      .get('http://170.75.251.46:10000/api/lvbp/getGames', {
        params:{
          'date':today
        }
      })
      .then(response => {
        this.response = response.data;
        this.displayPreloader = 'none'
        this.startRefreshData();
      })
    },
    paginateGames: function (type) {
      var newDay = (type=='add')?parseInt(this.day)+1:parseInt(this.day)-1;
      this.objDate.setDate(newDay);
      this.getDate();
      this.getDataGames(this.league,this.today);

    },
    getDate:function() {
        var arrMonths =[
          "Ene",
          "Feb",
          "Mar",
          "Abr",
          "May",
          "Jun",
          "Jul",
          "Ago",
          "Sep",
          "Oct",
          "Nov",
          "Dic"
        ]
        this.year  = this.objDate.getFullYear();
        var month  = this.objDate.getMonth()+1;
        this.month = (month>9)?month:'0'+month;
        this.nameMonth = arrMonths[this.objDate.getMonth()];
        var nowDay = this.objDate.getDate(); 
        this.day    = (nowDay>9)?nowDay:'0'+nowDay;
        this.isToday = (this.objNow.getDate()==this.day && this.objNow.getMonth()+1==month);
        this.today  = this.year+'-'+this.month+'-'+this.day
    },
    startRefreshData: function() {
      var inProgress = (this.response.length)?this.response.filter(response =>(response.Estado=='In Progress')).length:false
      
      if(this.isToday && inProgress){

            this.$socket.emit('setDataMlb',{
              date:this.today,
              interval:40000,
              league:this.league
            });

            this.sockets.subscribe('refresh_mlb', (data) => {
              if(data.length){
                this.dataLive = data;
                this.isLive = true;
                this.response = data
              }
            });

      }else{
          this.stopRefreshData();
      }
    },

    stopRefreshData: function(){
      this.sockets.unsubscribe('refresh_mlb');
    },

    getStatus:function (status) {
      
      let statusGames = {
        'Preview':'Hoy',
        'Pre-Game':'Hoy',
        'In Progress':'En Juego',
        'Game Over':'Final',
        'Warmup':'Calentando',
        'Manager challenge: T':'Revision',
        'Manager challenge: C':'Revision',
        'Final':'Final',
        'Delayed Start: Rain': 'RET: Lluvia',
        'Postponed':'Pospuesto',
        'Cancelled':'Cancelado'
      }
      return statusGames[status]
    },

    getTopBottomGame: function (statusTopBottom) {
      
      let arrTopBottom ={
        'Y':'▲',
        'N':'▼'
      }
      return arrTopBottom[statusTopBottom]
      
    },

    baseStyles: function(id,active){
      if(active.indexOf(id)!=-1){
        return {
          background:'#cae200',
          border: '1px solid #555'
        }
      }
    }
  },
  mounted() {

    this.getDataGames(this.league);
    this.navigationShow =  (this.screnWidth>=1024 && this.response.length>3)

  },
  watch:{
    datepicker:function(NewVal){
      this.showCalendar = false;
      this.objDate.setDate(NewVal.getDate());
      this.objDate.setMonth(NewVal.getMonth());
      this.objDate.setFullYear(NewVal.getFullYear());

      this.getDataGames(this.league)
    }
  }

}).$mount('#app');
