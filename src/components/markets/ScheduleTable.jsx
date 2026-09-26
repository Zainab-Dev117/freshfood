import React from 'react';
import { getWeeklySchedule } from '../../utils/engine';

export default function ScheduleTable({ market }) {
    if (!market) return null;
    const scheduleDays = getWeeklySchedule(market);

    return (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden" id="marketScheduleTableContainer">
            <div className="table-responsive">
                <table className="table schedule-table-custom align-middle mb-0">
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>Opening</th>
                            <th>Closing</th>
                            <th>Operating Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scheduleDays.map((row, idx) => (
                            <tr key={idx} className={row.isToday ? 'schedule-row-today' : ''}>
                                <td className="fw-bold">
                                    {row.day}
                                    {row.isToday && <span className="badge-today-tag ms-2">TODAY</span>}
                                </td>
                                <td>{row.opening}</td>
                                <td>{row.closing}</td>
                                <td>
                                    {row.isOpenDay ? (
                                        <span className="badge-open-day">
                                            <i className="fa-solid fa-circle-check me-1"></i> Open
                                        </span>
                                    ) : (
                                        <span className="badge-closed-day">
                                            <i className="fa-solid fa-minus me-1"></i> Closed
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
