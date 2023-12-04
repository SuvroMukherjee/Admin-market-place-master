import React from 'react'
import FeaturedInfo from '../../components/FeaturedInfo/FeaturedInfo'
import './Home.css'
import WidgetSm from '../../components/widgetSm/WidgetSm'
import WidgetLg from '../../components/WidgetLg/WidgetLg'

const Home = () => {
  return (
      <div className="home">
        
          <FeaturedInfo/>
          {/* <Chart data={userData} title="User Analytics" grid dataKey="Active User" /> */}
          <div className="homeWidgets">
              <WidgetSm/>
              <WidgetLg />
          </div>
      </div>
  )
}

export default Home