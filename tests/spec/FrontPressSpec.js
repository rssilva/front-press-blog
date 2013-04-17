describe('Page', function () {

	beforeEach(function () {
		loadFixtures('../../../../index.html');
	});

	describe('Quando o método initialize é chamado', function () {
		it ('deve chamar o método getConfig', function () {
			global.templates.mainTemplate = new global.templates.MainTemplate({start: false});
			
			spyOn(global.templates.mainTemplate, 'getConfig')

			global.templates.mainTemplate.initialize({start: true});
			expect(global.templates.mainTemplate.getConfig).toHaveBeenCalled();
		});
	});
});