import React from 'react'

import './dashboard.css'
// import WidgetSm from '../../components/widgetSm/WidgetSm'
// import WidgetLg from '../../components/WidgetLg/WidgetLg'
import FeaturedInfo from '../../../components/FeaturedInfo/FeaturedInfo'

const Dashboard = () => {
    return (
        <div className="home">

            <FeaturedInfo />
            {/* <Chart data={userData} title="User Analytics" grid dataKey="Active User" /> */}
            {/* <div className="homeWidgets">
                <WidgetSm />
                <WidgetLg />
            </div> */}
        </div>
    )
}

export default Dashboard