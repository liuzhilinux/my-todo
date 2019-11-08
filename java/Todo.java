import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;

/**
 * Ｔｏｄｏ 类。
 */
public class Todo {

    /**
     * 文字提示 Tips 。
     */
    private final String NO_CONTENT_ERR = "请填写任务内容。";
    private final String TASK_NO_EXIST_ERR = "任务不存在。";
    private final String NUM_ERR = "清输入合法的任务序号。";
    private final String STEP_ERR = "清输入合法的移动步数。";
    private final String ORIGIN_CONTENT_IS = "原内容是：";
    private final String PLEASE_INPUT_CONTENT = "请输入要修改的内容：";
    private final String YOUR_VERB_IS = "你的动作是： ";
    private final String I_DONT_KNOW_WHAT_YOUR_WANT = "我不知道你想干什么~";
    private final String ARE_YOU_SURE_CLEAR_ALL = "确认清空所有任务吗？[N/y]";

    /**
     * 数据库文件。
     */
    private String dbPath;

    /**
     * 动作。
     */
    private String verb = null;

    /**
     * 任务序号。
     */
    private int n = -1;

    /**
     * 任务内容。
     */
    private String content = null;

    /**
     * 移动步数。
     */
    private int n1 = -1;

    /**
     * 要修改成的任务内容。
     */
    private String content1 = null;

    /**
     * 任务类型。
     */
    private class Task {
        private String content;
        private boolean status;

        private Task(String content, boolean status) {
            this.content = content;
            this.status = status;
        }
    }

    /**
     * 主函数。
     * 
     * @param args
     */
    public static void main(String[] args) {
        Todo todo = new Todo(args);

        todo.init();

        todo.save();
    }

    public Todo(String[] args) {
        String dir = this.getClass().getResource("").getPath();
        this.dbPath = dir + "db";

        for (int i = 0; i < args.length; i++) {
            switch (i) {
            case 0:
                this.verb = args[i];
                break;
            case 1:
                this.n = Integer.parseInt(args[i]) - 1;
                this.content = args[i];
                break;
            case 2:
                this.n1 = Integer.parseInt(args[i]);
                this.content1 = args[i];
                break;
            }
        }
    }

    private void init() {
        String dbPath = this.dbPath;
        File dbFile = new File(this.dbPath);
        String json = null;

        if (!dbFile.exists()) {
            try {
                dbFile.createNewFile();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        try {
            StringBuffer sb = new StringBuffer();
            FileInputStream fis = new FileInputStream(dbPath);
            InputStreamReader isr = new InputStreamReader(fis, "UTF-8");
            BufferedReader reader = new BufferedReader(isr);

            String line = null;
            while ((line = reader.readLine()) != null) {
                sb.append(line + "\n");
            }

            json = sb.toString();
        } catch (IOException e) {
            e.printStackTrace();
        }

        System.out.println(json);
    }

    private void save() {
        String dbPath = this.dbPath;

        try {
            String json = "[]";
            FileOutputStream fos = new FileOutputStream(dbPath);
            OutputStreamWriter osw = new OutputStreamWriter(fos, "UTF-8");
            BufferedWriter writer = new BufferedWriter(osw);

            writer.write(json);
            writer.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}