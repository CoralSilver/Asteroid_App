(function () {
    csApi.getData(renderRecords.renderFilteredRecords);
    renderRecords.toggleRecordVisibility(document.getElementById('asteroids'));
    renderRecords.filterDangerous(document.getElementById('toggleButton'), document.getElementById('message'));
})();
