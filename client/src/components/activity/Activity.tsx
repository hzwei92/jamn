import { Entry } from "../../types/entry";
import { Profile } from "../../types/profile";

interface ActivityProps {
  entry: Entry;
  profile: Profile;
  depth: number;
}

const Activity = ({ profile }: ActivityProps) => {
  return (
    <div style={{
      marginLeft: 15,
      borderLeft: '2px solid',
      borderColor: profile.color,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        color: 'grey',
      }}>
        (activity)
      </div>
      {

      }
    </div>
  )
}

export default Activity;