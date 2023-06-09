import React, { useContext, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom' // import useLocation
import Accountstyle from './Account.module.css'
import { useNavigate } from 'react-router-dom'
import { UserOutlined, PlusCircleOutlined,LogoutOutlined } from '@ant-design/icons'
import { Avatar, Space } from 'antd'
import DropFile from './DropFile'
import Edit from './Edit.js'
import { AppContext } from '../../AppContext'
import axios from 'axios'
import { encrypt } from './../../utils/encryption'
import { Document, Page, pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

function Account() {
  let navigate = useNavigate()
  const [appData, setAppData] = useContext(AppContext)
  const inputRef = useRef(null)
  const location = useLocation() // use useLocation here

  const logout = () => {
    setAppData({})
    localStorage.removeItem('app-data')
    navigate('/Login')
  }

  const handleShareLinkClick = () => {
    const profileLink = `${location.origin}/profile/${appData?.user?.id}` // use location.origin
    inputRef.current.value = profileLink
    inputRef.current.select()
    document.execCommand('copy')
    alert('Profile link copied to clipboard!')
  }

  useEffect(() => {
    getCurrentUser()
  }, [])

  const getCurrentUser = async () => {
    console.log(appData)
    await axios
      .get('http://localhost:2000', {
        headers: {
          Authorization: `Bearer ${appData?.token}`
        }
      })
      .then(response => {
        console.log(response)
        localStorage.setItem(
          'app-data',
          encrypt({
            ...appData,
            user: { ...response?.data?.data?.user }
          })
        )
        setAppData({
          ...appData,
          user: { ...response?.data?.data?.user }
        })
      })
      .catch(error => {
        console.log(error)
        // setErrorMessages(error.response.data.messege)
      })
  }

  return (
    <div>
      <div className={Accountstyle.container1}>
        <div className={Accountstyle['profilPic']}>
          <Space>
            <Avatar icon={<UserOutlined />} size={200} />
          </Space>
        </div>
        <div>
          <div className={Accountstyle['profileName']}>
            <h2>
              {appData?.user?.firstName + ' ' + appData?.user?.lastName}
            </h2>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '20px'
            }}
          >
            <button
              className={Accountstyle['btn1']}
              onClick={handleShareLinkClick}
            >
              {' '}
              Share Link{' '}
            </button>
            <button
              onClick={() => {
                navigate('/PageJob')
              }}
              className={Accountstyle['btn2']}
            >
              {' '}
              Browse for a job offer{' '}
            </button>
            <button
              style={{
                backgroundColor: ' #E81A41',
                border: 'none',
                borderRadius: '35px',
                width: '150px',
                height: '50px',
                color: 'white',
                fontSize: '15px',
                marginLeft:'300px',
                cursor:'pointer'
              }}
              onClick={logout}
            >
              <span> <LogoutOutlined /> Log Out </span>
              
            </button>
          </div>
        </div>
      </div>

      {/* add this input below the button */}
      <input
        type="text"
        style={{ position: 'absolute', left: '-9999px' }}
        ref={inputRef}
      />

<div className={Accountstyle.container2}>
        <h2>My Resume</h2>
        {appData?.user?.generatedCVs?.length > 0 ? (
          <div className='cvs--grid'>
            {appData?.user?.generatedCVs?.map(cv => {
              return (
                <div
                  key={cv}
                  style={{
                    objectFit: 'contain',
                    border: '1px solid #BFBFBF'
                  }}
                >
                  <Document
                    onLoadError={err => console.log(err)}
                    
                    file={`http://localhost:2000/cvs/${cv}`}
                  >
                    <Page pageNumber={1} renderTextLayer={false} />
                  </Document>
                </div>
              )
            })}
          </div>
        ) : (
          <div className={Accountstyle.resumeBox}>
            <div className={Accountstyle['addSpace']}>
              <div className={Accountstyle['posAddIcon']}>
                <button className={Accountstyle['addBtn']}>
                  <Link to='/Resume'>
                    <PlusCircleOutlined
                      style={{ fontSize: '50px', color: '#BFBFBF' }}
                    />
                  </Link>
                </button>
              </div>
            </div>
          </div>
        )}

        <div>
        </div>
      </div>
      <div className={Accountstyle.container3}>
        <h2>My Cover Lettre</h2>
        {appData?.user?.generatedCLs?.length > 0 ? (

        <div className='cls--grid'>
            {appData?.user?.generatedCLs?.map(cl => {
              return (
                <div
                  key={cl}
                  style={{
                    objectFit: 'contain',
                    border: '1px solid #BFBFBF'
                  }}
                >
                  <Document
                    onLoadError={err => console.log(err)}
                    
                    file={`http://localhost:2000/cls/${cl}`}
                  >
                    <Page pageNumber={1} renderTextLayer={false} />
                  </Document>
                </div>
              )
            })}
          </div>
        ) : (
        <div className={Accountstyle.resumeBox}>
          <div className={Accountstyle['addSpace']}>
            <div className={Accountstyle['posAddIcon']}>
              <button className={Accountstyle['addBtn']}>
                <Link to='/CoverLettre'>
                  <PlusCircleOutlined
                    style={{ fontSize: '50px', color: '#BFBFBF' }}
                  />
                </Link>
              </button>
            </div>
          </div>
        </div>
        )}
      </div>

      <div className={Accountstyle.container4}>
        <h2>My Video</h2>
        <p>
          make a video to talk about yourself, talk about your skills and goals
          even about your hobbies.
        </p>
        <div>
          <DropFile />
        </div>
      </div>
    </div>
  
  )
}

export default Account