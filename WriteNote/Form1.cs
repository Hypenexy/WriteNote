using System;
using System.Data;
using System.Drawing;
using System.Drawing.Printing;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Windows.Forms;

namespace WriteNote
{
    public partial class mainyformy : Form
    {
        public mainyformy()
        {
            InitializeComponent();
        }

        public void darktheme()
        {
            richTextBox1.ForeColor = Color.GhostWhite;
            noteToolStripMenuItem.ForeColor = Color.Silver;
            editToolStripMenuItem.ForeColor = Color.Silver;
            themeToolStripMenuItem.ForeColor = Color.Silver;
            aboutToolStripMenuItem.ForeColor = Color.Silver;
            textBox1.BackColor = Color.FromArgb(18, 18, 18);
            menuStrip1.BackColor = Color.FromArgb(18, 18, 18);
            richTextBox1.BackColor = Color.FromArgb(34, 34, 44);
            richTextBox1.SelectAll();
            richTextBox1.SelectionColor = Color.GhostWhite;
            richTextBox1.BackColor = Color.FromArgb(34, 34, 44);
            richTextBox1.DeselectAll();
            pearlthemecheck();
        }

        public void lighttheme()
        {
            richTextBox1.ForeColor = Color.Black;
            noteToolStripMenuItem.ForeColor = Color.Black;
            editToolStripMenuItem.ForeColor = Color.Black;
            themeToolStripMenuItem.ForeColor = Color.Black;
            aboutToolStripMenuItem.ForeColor = Color.Black;
            textBox1.BackColor = Color.MistyRose;
            menuStrip1.BackColor = Color.MistyRose;
            richTextBox1.BackColor = Color.GhostWhite;
            richTextBox1.SelectAll();
            richTextBox1.SelectionColor = Color.Black;
            richTextBox1.BackColor = Color.GhostWhite;
            richTextBox1.DeselectAll();
            pearlthemecheck();
        }

        public void pearltheme()
        {
            bool b = menuStrip1.BackColor == Color.MistyRose;
            if (b == true)
            {
                menuStrip1.BackgroundImage = (Image)Properties.Resources.ResourceManager.GetObject("IxeoBackground");
                textBox1.BackColor = Color.LightBlue;
            }
            if (b == false)
            {
                menuStrip1.BackgroundImage = (Image)Properties.Resources.ResourceManager.GetObject("WriteNoteBackGround");
            }
        }
        public void pearlthemecheck()
        {
            StreamReader sr4 = new StreamReader("PearlDesign.WRProp");
            var pearlDesign = sr4.ReadToEnd();
            string s9 = "true";
            bool b9 = pearlDesign.Contains(s9);
            if (b9 == true)
            {
                pearlDesignToolStripMenuItem.Checked = true;
                pearltheme();
            }
            sr4.Close();
        }
        public void unpearltheme()
        {
            menuStrip1.BackgroundImage = base.BackgroundImage;
            textBox1.BackColor = Color.MistyRose;
        }

        public void fileCreation()
        {
            //creaton of files
            StreamWriter sw = new StreamWriter("Theme.WRProp", true);
            sw.Close();
            StreamWriter sw2 = new StreamWriter("CancelButton.WRProp", true);
            sw2.Close();
            StreamWriter sw3 = new StreamWriter("YesButton.WRProp", true);
            sw3.Close();
            StreamWriter sw4 = new StreamWriter("Quick.note", true);
            sw4.Close();
            StreamWriter sw5 = new StreamWriter("MenuPosition.WRProp", true);
            sw5.Close();
            StreamWriter sw6 = new StreamWriter("ShowCounter.WRProp", true);
            sw6.Close();
            StreamWriter sw7 = new StreamWriter("PearlDesign.WRProp", true);
            sw7.Close();
            StreamWriter sw8 = new StreamWriter("LastNote.WRProp", true);
            sw8.Close();
        }

        private void WriteNote_Load(object sender, EventArgs e)
        {
            //Assembly pearlThAssembly = Assembly.GetExecutingAssembly();
            //Stream pearlThStream = pearlThAssembly.GetManifestResourceStream("WriteNote.writenotebg.png");
            //richTextBox1.BackgroundImage = Image.FromStream( pearlThStream );
            //richTextBox1.BackgroundImage = Image.FromFile("C:/Users/hypen/Desktop/writenotebg.png");
            unsavedNote = false;
            textBox1.Visible = false;
            richTextBox1.SelectionFont = new Font("Arial", 16);
            richTextBox1.SelectionColor = Color.GhostWhite;

            fileCreation();

            StreamReader sr = new StreamReader("Theme.WRProp");
            var checkTheme = sr.ReadToEnd();
            string s1 = "light";
            bool b = checkTheme.Contains(s1);
            sr.Close();
            if (b == true)
            {
                lighttheme();
            }
            StreamReader sr2 = new StreamReader("MenuPosition.WRProp");
            var checkPos = sr2.ReadToEnd();
            string s3 = "top";
            bool b2 = checkPos.Contains(s3);
            if (b2 == true)
            {
                menuStrip1.Dock = DockStyle.Top;
            }
            string s5 = "left";
            bool b5 = checkPos.Contains(s5);
            if (b5 == true)
            {
                menuStrip1.Dock = DockStyle.Left;
            }
            string s6 = "right";
            bool b6 = checkPos.Contains(s6);
            if (b6 == true)
            {
                menuStrip1.Dock = DockStyle.Right;
            }
            string s7 = "bottom";
            bool b7 = checkPos.Contains(s7);
            if (b7 == true)
            {
                menuStrip1.Dock = DockStyle.Bottom;
            }
            sr2.Close();

            StreamReader sr3 = new StreamReader("ShowCounter.WRProp");
            var checkCounter = sr3.ReadToEnd();
            string s8 = "show";
            bool b8 = checkCounter.Contains(s8);
            if (b8 == true)
            {
                showWordsCounterToolStripMenuItem.Checked = true;
                textBox1.Visible = true;
            }
            sr3.Close();

            StreamReader sr4 = new StreamReader("PearlDesign.WRProp");
            var pearlDesign = sr4.ReadToEnd();
            string s9 = "true";
            bool b9 = pearlDesign.Contains(s9);
            if (b9 == true)
            {
                pearlDesignToolStripMenuItem.Checked = true;
                pearltheme();
            }
            sr4.Close();
            unsavedNote = false;
        }
        private bool unsavedNote;
        private string saveAsPlace = "1";
        private void newToolStripMenuItem_Click(object sender, EventArgs e)
        {
            richTextBox1.Clear();
            unsavedNote = false;
        }
        private void openToolStripMenuItem_Click(object sender, EventArgs e)
        {
            OpenFileDialog ofd = new OpenFileDialog();
            ofd.Filter = "Notes|*.txt|Special Notes|*.note|All files|*.*";
            ofd.Title = "Open a note";
            if (ofd.ShowDialog() == DialogResult.OK)
            {
                StreamReader sr = new StreamReader(ofd.FileName);
                richTextBox1.Text = sr.ReadToEnd();
                sr.Close();
                unsavedNote = false;
            }
        }
        private void saveToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if(saveAsPlace == "1")
            {
                SaveAs();
                return;
            }
            StreamWriter sw = new StreamWriter(saveAsPlace);
            sw.Write(richTextBox1.Text);
            sw.Close();
            unsavedNote = false;
        }
        private void undoToolStripMenuItem_Click(object sender, EventArgs e)
        {
            richTextBox1.Undo();
        }
        private void redoToolStripMenuItem_Click(object sender, EventArgs e)
        {
            richTextBox1.Redo();
        }
        private void cutToolStripMenuItem_Click(object sender, EventArgs e)
        {
            richTextBox1.Cut();
        }
        private void copyToolStripMenuItem_Click(object sender, EventArgs e)
        {
            richTextBox1.Copy();
        }
        private void pasteToolStripMenuItem_Click(object sender, EventArgs e)
        {
            richTextBox1.Paste();
            richTextBox1.SelectionFont = new Font("Arial", 16);
            if (menuStrip1.BackColor == Color.FromArgb(18, 18, 18))
            {
                richTextBox1.SelectionColor = Color.GhostWhite;
            }
            if (menuStrip1.BackColor == Color.MistyRose)
            {
                richTextBox1.SelectionColor = Color.Black;
            }
        }
        private void selectAllToolStripMenuItem_Click(object sender, EventArgs e)
        {
            richTextBox1.SelectAll();
        }
        private void colorsToolStripMenuItem_Click(object sender, EventArgs e)
        {
            darktheme();
            StreamWriter sw1 = new StreamWriter("Theme.WRProp");
            sw1.Write("dark");
            sw1.Close();
        }
        private void lightToolStripMenuItem_Click(object sender, EventArgs e)
        {
            lighttheme();
            StreamWriter sw1 = new StreamWriter("Theme.WRProp");
            sw1.Write("light");
            sw1.Close();
        }
        private void menuStrip1_ItemClicked(object sender, ToolStripItemClickedEventArgs e)
        {
        }
        private void topToolStripMenuItem_Click(object sender, EventArgs e)
        {
            menuStrip1.Dock = DockStyle.Top;
            StreamWriter sw1 = new StreamWriter("MenuPosition.WRProp");
            sw1.Write("top");
            sw1.Close();
        }
        private void leftToolStripMenuItem_Click(object sender, EventArgs e)
        {
            menuStrip1.Dock = DockStyle.Left;
            StreamWriter sw1 = new StreamWriter("MenuPosition.WRProp");
            sw1.Write("left");
            sw1.Close();
        }
        private void rightToolStripMenuItem_Click(object sender, EventArgs e)
        {
            menuStrip1.Dock = DockStyle.Right;
            StreamWriter sw1 = new StreamWriter("MenuPosition.WRProp");
            sw1.Write("right");
            sw1.Close();
        }
        private void bottomToolStripMenuItem_Click(object sender, EventArgs e)
        {
            menuStrip1.Dock = DockStyle.Bottom;
            StreamWriter sw1 = new StreamWriter("MenuPosition.WRProp");
            sw1.Write("bottom");
            sw1.Close();
        }

        private void richTextBox1_MouseMove(object sender, MouseEventArgs e)
        {
        }

        private void aboutToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Form2 f2 = new Form2();
            f2.ShowDialog();
        }

        private void textBox1_TextChanged(object sender, EventArgs e)
        {
        }
        private void richTextBox1_TextChanged(object sender, EventArgs e)
        {
            unsavedNote = true;
            int wordCount = Regex.Matches(richTextBox1.Text, @"\b[A-Za-z0-9]+\b").Count;
            var lineCount = richTextBox1.Lines.Count();
            var numberLabel = lineCount.ToString();
            textBox1.Text = "Words: " + wordCount + ", Symbols: " + richTextBox1.Text.Length + ", Lines: " + numberLabel;
        }
        private void showWordsCounterToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if(showWordsCounterToolStripMenuItem.Checked == false)
            {
                StreamWriter sw1 = new StreamWriter("ShowCounter.WRProp");
                sw1.Write("show");
                sw1.Close();
                showWordsCounterToolStripMenuItem.Checked = true;
                textBox1.Visible = true;
                return;
            }
            if (showWordsCounterToolStripMenuItem.Checked == true)
            {
                StreamWriter sw1 = new StreamWriter("ShowCounter.WRProp");
                sw1.Write("hide");
                sw1.Close();
                showWordsCounterToolStripMenuItem.Checked = false;
                textBox1.Visible = false;
            }
        }
        private void undoToolStripMenuItem1_Click(object sender, EventArgs e)
        {
            richTextBox1.Undo();
        }
        private void redoToolStripMenuItem1_Click(object sender, EventArgs e)
        {
            richTextBox1.Redo();
        }
        private void copyToolStripMenuItem1_Click(object sender, EventArgs e)
        {
            richTextBox1.Copy();
        }
        private void pasteToolStripMenuItem1_Click(object sender, EventArgs e)
        {
            richTextBox1.Paste();
        }
        private void noteToolStripMenuItem_Click(object sender, EventArgs e)
        {
        }
        private void toolStripTextBox1_Click(object sender, EventArgs e)
        {
        }
        private void saveToolStripMenuItem1_Click(object sender, EventArgs e)
        {
            StreamWriter sw = new StreamWriter("Quick.note");
            sw.Write(richTextBox1.Text);
            sw.Close();
            unsavedNote = false;
        }
        private void openToolStripMenuItem1_Click(object sender, EventArgs e)
        {
            StreamReader sr = new StreamReader("Quick.note");
            richTextBox1.Text = sr.ReadToEnd();
            sr.Close();
            unsavedNote = false;
        }
        private void mainyformy_FormClosing(object sender, FormClosingEventArgs e)
        {
            if (unsavedNote == true)
            {
                Form3 f3 = new Form3();
                f3.ShowDialog();
            }
            StreamReader sr = new StreamReader("CancelButton.WRProp");
            var checkCancelClose = sr.ReadToEnd();
            string s2 = "cancelClose";
            bool b = checkCancelClose.Contains(s2);
            sr.Close();
            if (b == true)
            {
                StreamWriter sw = new StreamWriter("CancelButton.WRProp");
                sw.Write("Thank you for using WriteNote <3");
                sw.Close();
                e.Cancel = true;
                return;
            }
            StreamReader sr2 = new StreamReader("YesButton.WRProp");
            var checkYesClose = sr2.ReadToEnd();
            string s3 = "saveClose";
            bool b2 = checkYesClose.Contains(s3);
            sr2.Close();
            if (b2 == true)
            {
                StreamWriter sw3 = new StreamWriter("YesButton.WRProp");
                sw3.Write("Thank you for using WriteNote <3");
                sw3.Close();
                SaveFileDialog svf = new SaveFileDialog();
                svf.Filter = "Notes|*.txt|Special Notes|*.note|All files|*.*";
                svf.Title = "Save note";
                if (svf.ShowDialog() == DialogResult.OK)
                {
                    StreamWriter sw = new StreamWriter(svf.FileName);
                    sw.Write(richTextBox1.Text);
                    sw.Close();
                    unsavedNote = false;
                }
                if (svf.ShowDialog() == DialogResult.Cancel)
                {
                    e.Cancel = true;
                }
            }
        }
        private void exitToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }

        private void calculateSelectionToolStripMenuItem_Click(object sender, EventArgs e)
        {
            calculateSelection();
        }

        private void calculateSelectionToolStripMenuItem1_Click(object sender, EventArgs e)
        {
            calculateSelection();
        }

        public void calculateSelection()
        {
            string exprs = richTextBox1.SelectedText;
            if (exprs != "")
            {
            double result = Convert.ToDouble(new DataTable().Compute(exprs, null));
            richTextBox1.AppendText("=" + result.ToString());
            }
        }

        private void findToolStripMenuItem_Click(object sender, EventArgs e)
        {
            findTheWord();
        }
        public void findTheWord()
        {
            string exprs = richTextBox1.SelectedText;
            Icon pearlicons = (Icon)Properties.Resources.ResourceManager.GetObject("writenotepearl");
            string findValue = Find.ShowFind(exprs, pearlicons, richTextBox1);

            string[] words = exprs.Split(',');
            foreach (string word in words)
            {
                int startindex = 0;
                while (startindex < richTextBox1.TextLength)
                {
                    int wordstartIndex = richTextBox1.Find(word, startindex, RichTextBoxFinds.None);
                    if (wordstartIndex != -1)
                    {
                        richTextBox1.SelectionStart = wordstartIndex;
                        richTextBox1.SelectionLength = word.Length;
                        richTextBox1.SelectionBackColor = Color.AliceBlue;
                        richTextBox1.SelectionColor = Color.Black;
                    }
                    else
                        break;
                    startindex += wordstartIndex + word.Length;
                }
            }
        }
        public class Find
        {
            public static string ShowFind(string expr, Icon pearlicon, RichTextBox richTextBox)
            {
                
                Form find = new Form();
                find.FormBorderStyle = FormBorderStyle.FixedDialog;
                find.StartPosition = FormStartPosition.CenterScreen;
                find.Icon = pearlicon;
                find.Width = 260;
                find.Height = 100;
                find.BackColor = Color.FromArgb(16,16,16);
                find.ForeColor = Color.Silver;
                find.Text = "Find Text";
                TextBox textBox = new TextBox() { Left = 10, Top = 20, Text = expr };
                Button findbtn = new Button() { Text = "Find", Left = 115, Width = 60, Top = 19 };
                Button close = new Button() { Text = "Clear", Left = 180, Width = 60, Top = 19 };
                StreamReader sr = new StreamReader("Theme.WRProp");
                textBox.BackColor = Color.FromArgb(34, 34, 34);
                textBox.ForeColor = Color.GhostWhite;
                var checkTheme = sr.ReadToEnd();
                string s1 = "light";
                bool b = checkTheme.Contains(s1);
                sr.Close();
                if (b == true)
                {
                    find.BackColor = Color.GhostWhite;
                    find.ForeColor = Color.Black;
                    textBox.BackColor = Color.GhostWhite;
                    textBox.ForeColor = Color.Black;
                    close.Click += (sender, e) => { find.Close(); };
                    find.FormClosed += (sender, e) => { richTextBox.SelectAll(); richTextBox.SelectionBackColor = Color.GhostWhite; richTextBox.SelectionColor = Color.Black; richTextBox.DeselectAll(); };
                }
                else
                {
                    close.Click += (sender, e) => { find.Close(); };
                    find.FormClosed += (sender, e) => { richTextBox.SelectAll(); richTextBox.SelectionBackColor = Color.FromArgb(36, 36, 36); richTextBox.SelectionColor = Color.GhostWhite; richTextBox.DeselectAll(); };
                }
                find.AcceptButton = findbtn;
                findbtn.Click += (sender, e) => {
                    if (b == true)
                    {
                        richTextBox.SelectAll(); richTextBox.SelectionBackColor = Color.GhostWhite; richTextBox.SelectionColor = Color.Black; richTextBox.DeselectAll();
                    }
                    else
                    {
                        richTextBox.SelectAll(); richTextBox.SelectionBackColor = Color.FromArgb(36, 36, 36); richTextBox.SelectionColor = Color.GhostWhite; richTextBox.DeselectAll();
                    }
                    string exprs = textBox.Text;
                    string[] words = exprs.Split(','); foreach (string word in words)
                    {
                        int startindex = 0;
                        while (startindex < richTextBox.TextLength)
                        {
                            int wordstartIndex = richTextBox.Find(word, startindex, RichTextBoxFinds.None);
                            if (wordstartIndex != -1)
                            {
                                richTextBox.SelectionStart = wordstartIndex;
                                richTextBox.SelectionLength = word.Length;
                                richTextBox.SelectionBackColor = Color.HotPink;
                                richTextBox.SelectionColor = Color.Black;
                            }
                            else
                                break;
                            startindex += wordstartIndex + word.Length;
                        }
                    }
                };
                find.Controls.Add(findbtn);
                find.Controls.Add(close);
                find.Controls.Add(textBox);
                find.Show();
                return textBox.Text;
            }
        }

        private void findToolStripMenuItem1_Click(object sender, EventArgs e)
        {
            findTheWord();
        }

        private void printToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (printDialog1.ShowDialog() == DialogResult.OK)
            {
                printDocument1.Print();
            }
        }

        private void printDocument1_BeginPrint(object sender, PrintEventArgs e)
        {
            char[] param = { '\n' };

            if (printDialog1.PrinterSettings.PrintRange == PrintRange.Selection)
            {
                lines = richTextBox1.SelectedText.Split(param);
            }
            else
            {
                lines = richTextBox1.Text.Split(param);
            }

            int i = 0;
            char[] trimParam = { '\r' };
            foreach (string s in lines)
            {
                lines[i++] = s.TrimEnd(trimParam);
            }
        }

        private int linesPrinted;
        private string[] lines;

        private void OnPrintPage(object sender, PrintPageEventArgs e)
        {
            int x = e.MarginBounds.Left;
            int y = e.MarginBounds.Top;
            Brush brush = new SolidBrush(richTextBox1.ForeColor);

            while (linesPrinted < lines.Length)
            {
                e.Graphics.DrawString(lines[linesPrinted++],
                    richTextBox1.Font, brush, x, y);
                y += 15;
                if (y >= e.MarginBounds.Bottom)
                {
                    e.HasMorePages = true;
                    return;
                }
            }

            linesPrinted = 0;
            e.HasMorePages = false;
        }

        private void convertSelectionToolStripMenuItem_Click(object sender, EventArgs e)
        {
            convertSelection();
        }

        private void convertSelectionToolStripMenuItem1_Click(object sender, EventArgs e)
        {
            convertSelection();
        }
        public void convertSelection()
        {
            int exprs = int.Parse(richTextBox1.SelectedText);
            var resultBinary = Convert.ToString(exprs, 2);
            var resultDecimal = exprs.ToString();
            var resultHex = Convert.ToString(exprs, 16);
            var resultOctal = Convert.ToString(exprs, 8);

            richTextBox1.AppendText(" = Binary: " + resultBinary.ToString() + ", Decimal: " + resultDecimal.ToString() + ", Hex: " + resultHex.ToString() + ", Octal: " + resultOctal.ToString());
        }

        private void pearlDesignToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (pearlDesignToolStripMenuItem.Checked == false)
            {
                pearlDesignToolStripMenuItem.Checked = true;
                pearltheme();
                StreamWriter sw1 = new StreamWriter("PearlDesign.WRProp");
                sw1.Write("true");
                sw1.Close();
                return;
            }
            if (pearlDesignToolStripMenuItem.Checked == true)
            {
                pearlDesignToolStripMenuItem.Checked = false;
                unpearltheme();
                StreamWriter sw1 = new StreamWriter("PearlDesign.WRProp");
                sw1.Write("false");
                sw1.Close();
            }
        }

        private void saveAsToolStripMenuItem_Click(object sender, EventArgs e)
        {
            SaveAs();
        }

        public void SaveAs()
        {
            SaveFileDialog svf = new SaveFileDialog();
            svf.Filter = "Notes (.txt)|*.txt";
            svf.Title = "Save note";
            if (svf.ShowDialog() == DialogResult.OK)
            {
                StreamWriter sw = new StreamWriter(svf.FileName);
                sw.Write(richTextBox1.Text);
                sw.Close();
                StreamWriter sw2 = new StreamWriter("LastNote.WRProp");
                sw2.Write(svf.FileName);
                sw2.Close();
                saveAsPlace = svf.FileName;
                unsavedNote = false;
            }
        }

        private void lastNotesToolStripMenuItem_Click(object sender, EventArgs e)
        {
            StreamReader sr1 = new StreamReader("LastNote.WRProp");
            string noteLocation = sr1.ReadToEnd();
            sr1.Close();
            if (noteLocation != "")
            {
                StreamReader sr = new StreamReader(noteLocation);
                richTextBox1.Text = sr.ReadToEnd();
                sr.Close();
            }
            unsavedNote = false;
            
        }

        private void changeFontToolStripMenuItem_Click(object sender, EventArgs e)
        {
            FontDialog fontDialog1 = new FontDialog();
            fontDialog1.ShowColor = true;
            if (fontDialog1.ShowDialog() != DialogResult.Cancel)
            {
                richTextBox1.Font = fontDialog1.Font;
                richTextBox1.ForeColor = fontDialog1.Color;
            }
        }
    }
}