function building_schema_initialize() { 

	hiddenHistory.schema_promt = new Promt()

	// Проверяем наличие библиотеки d3, и в случае, если она
	// загружена, выполняем загрузку основной части схемы
	if ( typeof(d3) == 'undefined' ) {

		hiddenHistory.schema_promt.fadeIn('возникла проблема с библиотекой d3.js');

		return

	}
	
	// класс, ответственный за создание элементов интерфейса
	hiddenHistory.schema_interface = new Building_schema_interface();

	hiddenHistory.schema_interface.init();


	// класс, ответственный за действия основной части схемы
	// Перемещение, масштаб, загрузка маркеров и т.д.
	hiddenHistory.schema = new Building_schema();

	hiddenHistory.schema.init();


};