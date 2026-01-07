import { 
  Tldraw, 
  DefaultMainMenu, 
  DefaultMainMenuContent, 
  TldrawUiMenuGroup, 
  TldrawUiMenuItem, 
  useEditor 
} from 'tldraw' 
import 'tldraw/tldraw.css' 
import jsPDF from 'jspdf' 
 
function CustomMainMenu() { 
  const editor = useEditor() 
 
  const handlePdfExport = async () => { 
    try { 
      const shapes = editor.getCurrentPageShapes() 
      if (shapes.length === 0) { 
        alert('No shapes to export') 
        return 
      } 
 
      const bounds = editor.getCurrentPageBounds() 
      
      if (!bounds) { 
        alert('Could not determine canvas bounds') 
        return 
      } 
 
      const svg = await editor.getSvgString(shapes.map(s => s.id), { 
        bounds, 
        background: true, 
        padding: 20, 
      }) 
 
      if (!svg) { 
        alert('Failed to generate SVG') 
        return 
      } 
 
      const pdf = new jsPDF({ 
        orientation: bounds.width > bounds.height ? 'landscape' : 'portrait', 
        unit: 'px', 
        format: [bounds.width + 40, bounds.height + 40] 
      }) 
 
      const img = new Image() 
      const svgBlob = new Blob([svg.svg], { type: 'image/svg+xml' }) 
      const url = URL.createObjectURL(svgBlob) 
 
      img.onload = () => { 
        pdf.addImage(img, 'PNG', 20, 20, bounds.width, bounds.height) 
        pdf.save('tldraw-export.pdf') 
        URL.revokeObjectURL(url) 
      } 
 
      img.onerror = () => { 
        alert('Failed to convert SVG to image') 
        URL.revokeObjectURL(url) 
      } 
 
      img.src = url 
    } catch (error) { 
      console.error('PDF export error:', error) 
      alert('Error exporting PDF: ' + error.message) 
    } 
  } 
 
  return ( 
    <DefaultMainMenu> 
      <DefaultMainMenuContent /> 
      <TldrawUiMenuGroup id="pdf-export"> 
        <TldrawUiMenuItem 
          id="export-pdf" 
          label="Export as PDF" 
          icon="external-link" 
          readonlyOk 
          onSelect={handlePdfExport} 
        /> 
      </TldrawUiMenuGroup> 
    </DefaultMainMenu> 
  ) 
} 
 
export default function App() { 
  return ( 
    <div style={{ position: 'fixed', inset: 0 }}> 
      <Tldraw 
        persistenceKey="my-local-tldraw" 
        components={{ 
          MainMenu: CustomMainMenu 
        }} 
      /> 
    </div> 
  ) 
}
