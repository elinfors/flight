import React, {useState, useEffect} from 'react'
import store from '../../../reducers'
import FilterScoolAndOrg from '../../../data/FilterScoolAndOrg'
import BarChart from './BarChart/BarChart'
import {Provider} from 'react-redux'
import Filter from './../../Filter'
import TopMenu from '../TopMenu/TopMenu'
import Footer from '../Footer/Footer'
import '../../../css/style.css'

const HomeScreen = props => {
  const [orgs, setOrgs] = useState(store.getState().getOrgs.data)
  const [schools, setSchools] = useState(
    store.getState().getSchools.data.map(schools => schools)
  )

  const [currentSchool, setCurrentSchool] = useState(
    store.getState().getSelectedSchool.data.length > 0
      ? store.getState().getSelectedSchool.data[0].school
      : 'All schools'
  )

  const [currentOrg, setCurrentOrg] = useState(
    store.getState().getSelectedOrg.data.length > 0
      ? store.getState().getSelectedOrg.data[0].org
      : ''
  )

  const [orgSelected, setSelectOrg] = useState(false)

  let filter = Filter()
  let organisationsList = React.createRef()
  let schoolsList = React.createRef()

  store.subscribe(() => {
    setOrgs(store.getState().getOrgs.data)
    //setSchools(store.getState().getSchools.data)
  })

  const schoolsButton = schools.map(school => {
    return (
      <button
        key={school.key}
        value={school.key}
        className={
          currentSchool === school.key
            ? 'btn-custom'
            : 'btn btn-dark'
        }
        id='schoolButton'
        onClick={handleSelectedSchool}
      >
        {school.key}
      </button>
    )
  })
  const orgTags = orgs.map(org => {
    return (
      <option key={org.key} value={org.key}>
        {org.key + ' ' + '(' + org.values.length + ' flights)'}
      </option>
    )
  })

  function handleSelectedSchool(e) {
    setCurrentOrg('DEFAULT')
    setSelectOrg(false)
    setCurrentSchool(e.target.value)
    FilterScoolAndOrg.setSchool(e.target.value)
  }

  function handleSelectedOrg(e) {
    setCurrentOrg(e.target.value)
    setSelectOrg(true)
    FilterScoolAndOrg.setOrg(e.target.value)
  }

  return (
    <React.Fragment>
      <TopMenu props={props}></TopMenu>
      <div className='NavBar'>
        <Provider store={store}>
          <BarChart filter={filter} type={'firstView'} />
        </Provider>
        <div id='selectSchoolOrg'>
          <h2>Select a school</h2>
          <div
            className='buttonContainer'
            onChange={handleSelectedSchool}
            ref={schoolsList}
          >
            <button
              key='All schools'
              value='All schools'
              className={
                currentSchool === 'All schools'
                  ? 'btn-custom'
                  : 'btn btn-dark'
              }
              id='schoolButton'
              onClick={handleSelectedSchool}
            >
              All Schools
            </button>
            {schoolsButton}
          </div>
          {currentSchool.length === 0 ||
          currentSchool === 'All schools' ? null : (
            <div>
              <h2>Select an organisation</h2>
              <select
                className='browser-default custom-select'
                id='organisations'
                onChange={handleSelectedOrg}
                ref={organisationsList}
                defaultValue={'DEFAULT'}
              >
                <option
                  key='Select an organisation'
                  value={'DEFAULT'}
                  disabled={true}
                  selected={currentOrg === 'DEFAULT' ? true : false}
                >
                  Select an organisation
                </option>
                {orgTags}
              </select>
            </div>
          )}
          {!orgSelected ? null : (
            <button
              className='btn btn-dark'
              id='schoolButton'
              onClick={() => props.history.push('/visualization/details')}
            >
              See Details
            </button>
          )}
        </div>
      </div>
      <Footer></Footer>
    </React.Fragment>
  )
}

export default HomeScreen
