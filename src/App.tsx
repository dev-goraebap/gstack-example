import { useMemo } from 'react';
import { format, parseISO, getISOWeek } from 'date-fns';
import { useBulletStore } from './hooks/useBulletStore';
import { useDateNav } from './hooks/useDateNav';
import GridPaper from './components/GridPaper';
import ViewNav from './components/ViewNav';
import DailyLog from './components/DailyLog';
import WeeklyView from './components/WeeklyView';
import MonthlyLog from './components/MonthlyLog';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function App() {
  const {
    loaded,
    storageError,
    addBullet,
    updateBullet,
    deleteBullet,
    getBulletsByDate,
    getBulletsByDateRange,
  } = useBulletStore();

  const {
    currentDate,
    viewMode,
    setViewMode,
    goNext,
    goPrev,
    goToDate,
  } = useDateNav();

  const dateTitle = useMemo(() => {
    const parsed = parseISO(currentDate);
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    if (viewMode === 'daily') {
      return `${format(parsed, 'yyyy. MM. dd.')} ${dayNames[parsed.getDay()]}`;
    }
    if (viewMode === 'weekly') {
      const week = getISOWeek(parsed);
      return `${format(parsed, 'yyyy.')} W${week}`;
    }
    return `${format(parsed, 'yyyy.')} ${MONTH_NAMES[parsed.getMonth()]}`;
  }, [currentDate, viewMode]);

  const dailyBullets = useMemo(() => {
    return getBulletsByDate(currentDate);
  }, [getBulletsByDate, currentDate]);

  const handleDayClick = (date: string) => {
    goToDate(date, 'daily');
  };

  if (!loaded) {
    return (
      <GridPaper>
        <div style={{ color: 'var(--ink-light)', padding: 'var(--grid-size)' }}>
          로딩 중...
        </div>
      </GridPaper>
    );
  }

  return (
    <GridPaper>
      {storageError && (
        <div
          className="text-xs"
          style={{
            padding: '8px',
            background: '#fee',
            color: '#c00',
            marginBottom: 'var(--grid-size)',
            borderRadius: '2px',
          }}
        >
          저장소 오류: 데이터가 메모리에만 유지됩니다. 브라우저를 닫으면 사라집니다.
        </div>
      )}

      <ViewNav
        dateTitle={dateTitle}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onPrev={goPrev}
        onNext={goNext}
      />

      {viewMode === 'daily' && (
        <DailyLog
          date={currentDate}
          bullets={dailyBullets}
          onAdd={addBullet}
          onUpdate={updateBullet}
          onDelete={deleteBullet}
        />
      )}

      {viewMode === 'weekly' && (
        <WeeklyView
          currentDate={currentDate}
          getBulletsByDateRange={getBulletsByDateRange}
          onDayClick={handleDayClick}
        />
      )}

      {viewMode === 'monthly' && (
        <MonthlyLog
          currentDate={currentDate}
          getBulletsByDateRange={getBulletsByDateRange}
          onDayClick={handleDayClick}
        />
      )}
    </GridPaper>
  );
}

export default App;
