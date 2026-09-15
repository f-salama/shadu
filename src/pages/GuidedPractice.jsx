import { useChild } from '../context/ChildContext';
import { exercisesBySound } from '../data/mockData';
import PageHeader from '../components/ui/PageHeader';
import './GuidedPractice.css';

export default function GuidedPractice() {
  const { child } = useChild();
  const exercises = exercisesBySound[child.targetSound] || [];

  return (
    <div>
      <PageHeader
        title="التمارين المنزلية الموجّهة"
        subtitle={`تمارين عملية يمكنكِ ممارستها مع ${child.nickname || child.name} لتدريب صوت ${child.targetSound}، بدون الحاجة لأي أدوات خاصة.`}
      />

      <div className="practice-tip-banner">
        <strong>نصيحة عامة:</strong> اختاري وقتًا يكون فيه طفلك مرتاحًا وغير متعب، وحافظي على أجواء إيجابية وخالية من
        الضغط. توقفي فورًا إذا شعر طفلك بالإحباط، وأكملا لاحقًا.
      </div>

      <div className="practice-list">
        {exercises.map((exercise, idx) => (
          <section className="card card-pad practice-card" key={exercise.id}>
            <div className="practice-card-header">
              <span className="practice-card-number">{idx + 1}</span>
              <div>
                <h2>{exercise.title}</h2>
                <p className="practice-card-goal">{exercise.goal}</p>
              </div>
              <span className="badge badge-neutral practice-card-duration">{exercise.durationMinutes} دقائق</span>
            </div>

            {exercise.materials?.length > 0 && (
              <div className="practice-materials">
                <span className="practice-materials-label">الأدوات المطلوبة:</span>
                <span>{exercise.materials.join('، ')}</span>
              </div>
            )}

            <ol className="practice-steps">
              {exercise.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>

            {exercise.tip && (
              <div className="practice-tip">
                <strong>نصيحة: </strong>
                {exercise.tip}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
