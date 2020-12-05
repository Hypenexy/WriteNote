using System;
using System.Drawing;
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
        private void WriteNote_Load(object sender, EventArgs e)
        {
            unsavedNote = false;
            textBox1.Visible = false;
            richTextBox1.SelectionFont = new Font("Arial", 16);
            richTextBox1.SelectionColor = System.Drawing.Color.GhostWhite;
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
            //theme
            StreamReader sr = new StreamReader("Theme.WRProp");
            var checkTheme = sr.ReadToEnd();
            string s1 = "light";
            bool b = checkTheme.Contains(s1);
            sr.Close();
            if (b == true)
            {
                noteToolStripMenuItem.ForeColor = Color.Black;
                editToolStripMenuItem.ForeColor = Color.Black;
                themeToolStripMenuItem.ForeColor = Color.Black;
                aboutToolStripMenuItem.ForeColor = Color.Black;
                textBox1.BackColor = Color.MistyRose;
                menuStrip1.BackColor = Color.MistyRose;
                richTextBox1.BackColor = Color.GhostWhite;
                richTextBox1.SelectAll();
                richTextBox1.SelectionFont = new Font("Arial", 16);
                richTextBox1.SelectionColor = System.Drawing.Color.Black;
                richTextBox1.Select();
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
        }
        private bool unsavedNote;
        private void newToolStripMenuItem_Click(object sender, EventArgs e)
        {
            richTextBox1.Clear(); 
            unsavedNote = false;
        }
        private void openToolStripMenuItem_Click(object sender, EventArgs e)
        {
            OpenFileDialog ofd = new OpenFileDialog();
            ofd.Filter = "Notes (.txt)|*.txt";
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
            SaveFileDialog svf = new SaveFileDialog();
            svf.Filter = "Notes (.txt)|*.txt";
            svf.Title = "Save note";
            if (svf.ShowDialog() == DialogResult.OK)
            {
                StreamWriter sw = new StreamWriter(svf.FileName);
                sw.Write(richTextBox1.Text);
                sw.Close();
                unsavedNote = false;
            }
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
                richTextBox1.SelectionColor = System.Drawing.Color.GhostWhite;
            }
            if (menuStrip1.BackColor == Color.MistyRose)
            {
                richTextBox1.SelectionColor = System.Drawing.Color.Black;
            }
        }
        private void selectAllToolStripMenuItem_Click(object sender, EventArgs e)
        {
            richTextBox1.SelectAll();
        }
        private void colorsToolStripMenuItem_Click(object sender, EventArgs e)
        {
            //richTextBox1.BorderStyle = BorderStyle.None;
            //Properties.Settings.Default.SettingsKey = "Dark";
            noteToolStripMenuItem.ForeColor = Color.Silver;
            editToolStripMenuItem.ForeColor = Color.Silver;
            themeToolStripMenuItem.ForeColor = Color.Silver;
            aboutToolStripMenuItem.ForeColor = Color.Silver;
            textBox1.BackColor = Color.FromArgb(18, 18, 18);
            menuStrip1.BackColor = Color.FromArgb(18, 18, 18);
            richTextBox1.BackColor = Color.FromArgb(34, 34, 44);
            richTextBox1.SelectAll();
            richTextBox1.SelectionFont = new Font("Arial", 16);
            richTextBox1.SelectionColor = System.Drawing.Color.GhostWhite;
            richTextBox1.Select();
            StreamWriter sw1 = new StreamWriter("Theme.WRProp");
            sw1.Write("dark");
            sw1.Close();
        }
        private void lightToolStripMenuItem_Click(object sender, EventArgs e)
        {
            noteToolStripMenuItem.ForeColor = Color.Black;
            editToolStripMenuItem.ForeColor = Color.Black;
            themeToolStripMenuItem.ForeColor = Color.Black;
            aboutToolStripMenuItem.ForeColor = Color.Black;
            textBox1.BackColor = Color.MistyRose;
            menuStrip1.BackColor = Color.MistyRose;
            richTextBox1.BackColor = Color.GhostWhite;
            richTextBox1.SelectAll();
            richTextBox1.SelectionFont = new Font("Arial", 16);
            richTextBox1.SelectionColor = System.Drawing.Color.Black;
            richTextBox1.Select();
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
                svf.Filter = "Notes (.txt)|*.txt";
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
    }
}