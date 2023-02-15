import { Entry } from "../../types/entry";
import { Profile } from "../../types/profile";

interface LeadersProps {
  entry: Entry;
  profile: Profile;
  depth: number;
}

const Leaders = ({ profile }: LeadersProps) => {
  return (
    <div style={{
      marginLeft: 15,
      borderLeft: '2px solid',
      borderColor: profile.color,
      display: 'flex',
      flexDirection: 'column',
      borderBottomLeftRadius: 5,
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
        (leaders)
      </div>
      {

      }
    </div>
  )
}

export default Leaders;