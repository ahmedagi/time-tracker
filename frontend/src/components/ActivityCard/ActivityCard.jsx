import { Link, useNavigate } from 'react-router-dom';
import styles from './activity-card.module.css';

export default function ActivityCard({ activity, allActivities }) {
  const navigate = useNavigate();

  async function handleClick() {
    if (activity.archived) {
      return navigate(`activity/${activity.name}`);
    }
    const res = await fetch('http://localhost:8000/api/v1/records', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        activityId: activity.id,
        startedAt: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to start record');
    }
    navigate('.');
  }

  return (
    <div
      className={styles.cardContainer}
      style={{
        backgroundColor: activity.color,
        // background: `linear-gradient(135deg, ${activity.color}, ${
        //   activity.color + '88'
        // })`,
      }}
      onClick={handleClick}
    >
      <div className={styles.nameContainer}>
        <span>{activity.name}</span>
      </div>
      <div className={styles.editContainer}>
        <Link
          className={styles.editLink}
          onClick={(e) => {
            e.stopPropagation();
          }}
          to={`activity/${activity.name}`}
        >
          Edit
        </Link>
      </div>
    </div>
  );
}