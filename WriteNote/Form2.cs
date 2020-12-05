using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace WriteNote
{
    public partial class Form2 : Form
    {
        public Form2()
        {
            InitializeComponent();
        }

        private void label1_Click(object sender, EventArgs e)
        {
            Application.Run(new Snake());
        }
        private void label2_Click(object sender, EventArgs e)
        {
        }
        private void Form2_Load(object sender, EventArgs e)
        {
            StreamReader sr = new StreamReader("Theme.WRProp");
            var checkTheme = sr.ReadToEnd();
            string s1 = "light";
            bool b = checkTheme.Contains(s1);
            sr.Close();
            if (b == true)
            {
                richTextBox1.ForeColor = Color.Black;
                richTextBox1.BackColor = Color.GhostWhite;
                label1.ForeColor = Color.Black;
                label1.BackColor = Color.GhostWhite;
                back.ForeColor = Color.Black;
                back.BackColor = Color.GhostWhite;
            }
        }

        private void back_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        private void backToolStripMenuItem_Click(object sender, EventArgs e)
        {
            this.Close();
        }
    }
}
