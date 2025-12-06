// UI module

export function renderHistory(entries) {
    const historyList = document.getElementById('historyList');

    if (!entries || entries.length === 0) {
        historyList.innerHTML = '<p class="empty-message">No entries yet. Start logging your wellness!</p>';
        return;
    }

    historyList.innerHTML = entries.map(entry => {
        const date = new Date(entry.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const symptomsText = entry.symptoms && entry.symptoms.length > 0
            ? entry.symptoms.join(', ')
            : 'No symptoms';

        return `
      <div class="history-item">
        <div class="history-item-header">
          <span class="history-date">${formattedDate}</span>
          <div class="history-ratings">
            <span>Energy: ${entry.energyLevel}/10</span>
            <span>Pain: ${entry.painLevel}/10</span>
          </div>
        </div>
        <div class="history-details">
          <p><strong>Moon:</strong> ${entry.moonPhase} | <strong>Pressure:</strong> ${entry.pressure} hPa</p>
          <p><strong>Symptoms:</strong> ${symptomsText}</p>
          ${entry.notes ? `<p><strong>Notes:</strong> ${entry.notes}</p>` : ''}
        </div>
      </div>
    `;
    }).join('');
}