import {Line, mixins} from 'vue-chartjs'
import axios from 'axios';

const { reactiveProp } = mixins

export default {
  extends: Line,
  props:['options'],
  mixins: [reactiveProp],
  data () {
    return {
      datacollection: null,
    }
  },
  mounted () {
    axios.get('v1/me/statistic/daily/all?type=comment&from=last_week')
      .then(
        res=> {
          this.datacollection= {
            labels: ['January', 'February', 'December', 'October', 'November', "December", "sdddsds"],
              datasets: [
              {
                label: 'Data One',
                backgroundColor: '#5ac5c6',
                data: [1,4,3,5,6,2,9],
              },
            ]
          };
          this.datacollection.datasets.data=res.data.map( (el) =>  {
            return el.count;
          });

          setTimeout(()=>{
            this.renderChart(this.datacollection,{responsive: true, maintainAspectRatio: false});
          }, 1000)

        }
      );

  },

}

