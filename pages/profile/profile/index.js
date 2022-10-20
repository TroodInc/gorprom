import { observer } from 'mobx-react'
import ProfileLayout from '../../../layout/profile'


const Profile = () => {
  return 'My Profile'
}

Profile.SubLayout = ProfileLayout

export default observer(Profile)
