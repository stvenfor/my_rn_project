import {BFUI_TEMPLATES, findBfuiTemplate} from '../bfuiCatalog';
import {BFUI_TEMPLATE_COMPONENTS} from '../templates/templateRegistry';
import {bfuiImages, BFUI_FONTS} from '../assets/bfuiAssets';

describe('bfuiCatalog', () => {
  it('registers 17 templates with matching components', () => {
    expect(BFUI_TEMPLATES).toHaveLength(17);
    for (const entry of BFUI_TEMPLATES) {
      expect(BFUI_TEMPLATE_COMPONENTS[entry.id]).toBeDefined();
      expect(findBfuiTemplate(entry.id)?.flutterRoute).toContain('/bfui/');
    }
  });

  it('marks effect templates as visual-degraded and mediterranean as shell', () => {
    expect(findBfuiTemplate('glass_view')?.status).toBe('visual-degraded');
    expect(findBfuiTemplate('wave_view')?.status).toBe('visual-degraded');
    expect(findBfuiTemplate('mediterranean_diet')?.status).toBe('shell');
  });

  it('exposes local image and font registries', () => {
    expect(bfuiImages.hotel_hotel_1).toBeDefined();
    expect(bfuiImages.fitness_app_breakfast).toBeDefined();
    expect(bfuiImages.design_course_interFace1).toBeDefined();
    expect(BFUI_FONTS.workSansBold).toBe('WorkSans-Bold');
    expect(BFUI_FONTS.robotoBold).toBe('Roboto-Bold');
  });
});
